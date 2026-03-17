"""
surveillance/routes/surveillance_routes.py
-------------------------------------------
Flask Blueprint — thin HTTP layer only.
All business logic lives in the services layer.
"""

import os
import time
import threading

import cv2
import numpy as np
from flask import Blueprint, Response, jsonify

from surveillance.config.settings import (
    UNKNOWN_VIDEOS_DIR,
    COOLDOWN_SECONDS,
    PROCESS_EVERY_N_FRAMES,
)
from surveillance.services.face_processor import process_frame, annotate_frame
from surveillance.services.frame_buffer import FrameBuffer
from surveillance.services.log_writer import append_to_json_file
from surveillance.services.recorder import record_unknown_video, is_recording
from surveillance.services.user_loader import load_known_faces, start_reload_thread

surveillance_bp = Blueprint("surveillance", __name__)

# ── Module-level state (initialised once when Blueprint is imported) ───────────
_known_faces = load_known_faces()
start_reload_thread(_known_faces)

_last_seen: dict = {}   # name → last log timestamp


# ── Routes ────────────────────────────────────────────────────────────────────

@surveillance_bp.route("/live_feed")
def live_feed():
    return Response(
        _generate_live_feed(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


@surveillance_bp.route("/unknown_videos/<filename>")
def serve_unknown_video(filename: str):
    video_path = os.path.join(UNKNOWN_VIDEOS_DIR, filename)
    try:
        with open(video_path, "rb") as f:
            return Response(f.read(), mimetype="video/mp4")
    except FileNotFoundError:
        return jsonify({"message": "Video not found."}), 404


@surveillance_bp.route("/unknown_videos")
def list_unknown_videos():
    videos = []
    try:
        for filename in os.listdir(UNKNOWN_VIDEOS_DIR):
            if filename.endswith(".mp4"):
                videos.append({
                    "filename": filename,
                    "path": f"/unknown_videos/{filename}",
                    "timestamp": filename.split("_")[1].split(".")[0],
                })
    except Exception as e:
        print(f"Error listing unknown videos: {e}")
    return jsonify({"videos": videos})


# ── Live-feed generator ───────────────────────────────────────────────────────

def _generate_live_feed():
    buffer = FrameBuffer()

    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Failed to open camera.")
            blank = np.zeros((300, 400, 3), dtype=np.uint8)
            _, jpg = cv2.imencode(".jpg", blank)
            yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n"
            return

        buffer.start(cap)
        print("✅ Frame buffer started.")

        frame_count = 0
        last_detections = []  # reused between recognition frames

        while True:
            ret, frame = cap.read()
            if not ret:
                time.sleep(0.1)
                continue

            frame_count += 1

            # Run expensive recognition only every Nth frame
            if frame_count % PROCESS_EVERY_N_FRAMES == 0:
                encodings, names = _known_faces.snapshot()
                last_detections = process_frame(frame, encodings, names)
                _handle_detections(last_detections, buffer)

            # Annotate every frame with the most recent detections
            annotate_frame(frame, last_detections)

            _, jpg = cv2.imencode(".jpg", frame)
            yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n"
            time.sleep(0.01)

    except Exception as e:
        print(f"❌ Live feed error: {e}")
    finally:
        buffer.stop()
        if "cap" in locals():
            cap.release()


def _handle_detections(detections: list, buffer: FrameBuffer) -> None:
    """Log events and trigger recording for unknown faces."""
    current_time = time.time()

    for d in detections:
        name = d["name"]
        if current_time - _last_seen.get(name, 0) <= COOLDOWN_SECONDS:
            continue  # Still within cooldown

        _last_seen[name] = current_time

        if name == "Unknown":
            if not is_recording():
                threading.Thread(
                    target=record_unknown_video,
                    args=(buffer,),
                    daemon=True,
                ).start()
        else:
            append_to_json_file("recognized_log_test.json", {
                "name": name,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time)),
            })