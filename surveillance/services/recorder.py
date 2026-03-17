"""
surveillance/services/recorder.py
-----------------------------------
Writes a video clip of an unknown face to disk.
Uses a priority-ordered list of codecs and falls back to saving JPEG frames
if no codec is available.
"""

import os
import time
import threading
from datetime import datetime

import cv2

from surveillance.config.settings import (
    UNKNOWN_VIDEOS_DIR,
    POST_DETECTION_SECONDS,
    RECORDING_FPS,
    MIN_FRAMES_FOR_VIDEO,
)
from surveillance.services.log_writer import append_to_json_file

os.makedirs(UNKNOWN_VIDEOS_DIR, exist_ok=True)

_recording_lock = threading.Lock()
_recording_in_progress = False

# Codecs tried in order; first one that opens successfully is used
_CODEC_PRIORITY = [
    ("avc1", "H.264"),
    ("mp4v", "MPEG-4"),
    ("XVID", "XVID"),
    ("MJPG", "Motion JPEG"),
]


def is_recording() -> bool:
    return _recording_in_progress


def record_unknown_video(frame_buffer) -> None:
    """
    Capture a clip around an unknown-face detection event.

    frame_buffer: a FrameBuffer instance already running.
    Intended to be called from a daemon thread.
    """
    global _recording_in_progress

    with _recording_lock:
        if _recording_in_progress:
            return
        _recording_in_progress = True

    try:
        _do_record(frame_buffer)
    finally:
        with _recording_lock:
            _recording_in_progress = False


# ── Private helpers ────────────────────────────────────────────────────────────

def _do_record(frame_buffer) -> None:
    detection_time = datetime.now()
    timestamp = detection_time.strftime("%Y%m%d_%H%M%S")
    video_path = os.path.join(UNKNOWN_VIDEOS_DIR, f"unknown_{timestamp}.mp4")

    # Grab whatever is already buffered (pre-detection frames)
    buffered = frame_buffer.drain()
    print(f"📋 Pre-detection frames: {len(buffered)}")

    # Collect additional post-detection frames
    post_frames = []
    needed = int(POST_DETECTION_SECONDS * RECORDING_FPS)
    deadline = time.time() + POST_DETECTION_SECONDS * 1.5

    while len(post_frames) < needed and time.time() < deadline:
        item = frame_buffer.get(timeout=0.1)
        if item:
            post_frames.append(item)

    print(f"📋 Post-detection frames: {len(post_frames)}")
    all_frames = buffered + post_frames

    if len(all_frames) < MIN_FRAMES_FOR_VIDEO:
        print("❌ Not enough frames — skipping video.")
        return

    first_frame, _ = all_frames[0]
    h, w = first_frame.shape[:2]

    writer = _open_writer(video_path, w, h, timestamp)

    if writer is None:
        _save_as_images(all_frames, timestamp, detection_time)
        return

    writer_obj, codec_name = writer
    _write_frames(writer_obj, all_frames, detection_time)
    writer_obj.release()

    if not os.path.exists(video_path) or os.path.getsize(video_path) < 1000:
        print("❌ Video file too small or missing after write.")
        if os.path.exists(video_path):
            os.remove(video_path)
        return

    duration = len(all_frames) / RECORDING_FPS
    print(f"✅ Saved {video_path} ({os.path.getsize(video_path)} bytes, {codec_name})")

    append_to_json_file("unknown_log_test.json", {
        "name": "Unknown",
        "timestamp": detection_time.strftime("%Y-%m-%d %H:%M:%S"),
        "video_path": f"/unknown_videos/{os.path.basename(video_path)}",
        "duration": f"{duration:.2f}s",
        "codec": codec_name,
    })


def _open_writer(path: str, w: int, h: int, ts: str):
    """Try each codec in priority order. Returns (VideoWriter, codec_name) or None."""
    for code, name in _CODEC_PRIORITY:
        try:
            fourcc = cv2.VideoWriter_fourcc(*code)
            test_path = os.path.join(UNKNOWN_VIDEOS_DIR, f"_test_{ts}.mp4")
            test = cv2.VideoWriter(test_path, fourcc, RECORDING_FPS, (w, h))
            if test.isOpened():
                test.release()
                if os.path.exists(test_path):
                    os.remove(test_path)
                writer = cv2.VideoWriter(path, fourcc, RECORDING_FPS, (w, h))
                if writer.isOpened():
                    print(f"✅ Using codec: {name}")
                    return writer, name
        except Exception as e:
            print(f"⚠️ Codec {name} failed: {e}")

    # Last resort: uncompressed AVI
    try:
        avi_path = path.replace(".mp4", ".avi")
        writer = cv2.VideoWriter(avi_path, 0, RECORDING_FPS, (w, h))
        if writer.isOpened():
            return writer, "Uncompressed"
    except Exception as e:
        print(f"⚠️ Uncompressed fallback failed: {e}")

    return None


def _write_frames(writer: cv2.VideoWriter, frames: list, detection_time: datetime) -> None:
    for frame, frame_time in frames:
        delta = (frame_time - detection_time).total_seconds()
        cv2.putText(frame, f"SECURITY RECORDING ({delta:.1f}s)",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        cv2.putText(frame, f"Time: {frame_time.strftime('%H:%M:%S.%f')[:-4]}",
                    (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 1)
        writer.write(frame)


def _save_as_images(frames: list, ts: str, detection_time: datetime) -> None:
    """Fallback: save frames as individual JPEGs when no video codec works."""
    images_dir = os.path.join(UNKNOWN_VIDEOS_DIR, f"unknown_{ts}_frames")
    os.makedirs(images_dir, exist_ok=True)
    for i, (frame, _) in enumerate(frames):
        cv2.imwrite(os.path.join(images_dir, f"frame_{i:04d}.jpg"), frame)
    print(f"✅ Saved {len(frames)} frames as images in {images_dir}")

    append_to_json_file("unknown_log_test.json", {
        "name": "Unknown",
        "timestamp": detection_time.strftime("%Y-%m-%d %H:%M:%S"),
        "images_path": f"/unknown_videos/{os.path.basename(images_dir)}",
        "frame_count": len(frames),
    })