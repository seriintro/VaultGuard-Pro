"""
surveillance/services/frame_buffer.py
---------------------------------------
Runs a background thread that continuously reads frames from the camera
and keeps a rolling window of the most recent ones.
The live feed and recorder both pull from this single source.
"""

import queue
import threading
import time
from datetime import datetime

import cv2

from surveillance.config.settings import BUFFER_SECONDS, POST_DETECTION_SECONDS, FPS_ESTIMATE

# Size the queue to hold the full pre + post detection window
_MAX_QUEUE_SIZE = int((BUFFER_SECONDS + POST_DETECTION_SECONDS) * FPS_ESTIMATE)


class FrameBuffer:
    """
    Thread-safe rolling buffer of (frame, timestamp) tuples.

    Call start(video_capture) to begin collecting, stop() to shut down.
    """

    def __init__(self):
        self._queue: queue.Queue = queue.Queue(maxsize=_MAX_QUEUE_SIZE)
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    # ── Public API ────────────────────────────────────────────────────────────

    def start(self, video_capture: cv2.VideoCapture) -> None:
        self._stop_event.clear()
        self._thread = threading.Thread(
            target=self._collect,
            args=(video_capture,),
            daemon=True,
        )
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=1.0)

    def drain(self) -> list:
        """Return all currently buffered (frame, timestamp) pairs without blocking."""
        frames = []
        try:
            while True:
                frames.append(self._queue.get_nowait())
        except queue.Empty:
            pass
        return frames

    def get(self, timeout: float = 0.1):
        """Block until a frame is available (or timeout). Returns None on timeout."""
        try:
            return self._queue.get(timeout=timeout)
        except queue.Empty:
            return None

    # ── Internal ──────────────────────────────────────────────────────────────

    def _collect(self, cap: cv2.VideoCapture) -> None:
        while not self._stop_event.is_set():
            ret, frame = cap.read()
            if ret:
                if self._queue.full():
                    try:
                        self._queue.get_nowait()   # drop oldest frame
                    except queue.Empty:
                        pass
                try:
                    self._queue.put((frame.copy(), datetime.now()), timeout=0.1)
                except queue.Full:
                    pass
            time.sleep(0.01)