"""
surveillance/services/user_loader.py
--------------------------------------
Loads user encodings from the database and keeps them fresh in memory.
Runs a background reload thread so the live feed always uses up-to-date faces.
"""

import json
import time
import threading
import numpy as np

from security_utils import decrypt_data
from surveillance.config.settings import USER_DB_FILE, USER_RELOAD_INTERVAL


class KnownFaces:
    """Thread-safe container for known face encodings and names."""

    def __init__(self):
        self._lock = threading.RLock()
        self.encodings: list = []
        self.names: list = []

    def update(self, encodings: list, names: list) -> None:
        with self._lock:
            self.encodings = encodings
            self.names = names

    def snapshot(self) -> tuple:
        """Return a stable (encodings, names) copy safe to iterate over."""
        with self._lock:
            return list(self.encodings), list(self.names)


def _load_raw_users() -> list:
    """Read the user JSON file and decrypt image paths."""
    try:
        with open(USER_DB_FILE, "r") as f:
            users = json.load(f)
        for user in users:
            ip = user.get("image_path", "")
            if ip.startswith("gAAAAAB"):
                try:
                    user["image_path"] = decrypt_data(ip)
                except Exception:
                    pass
        return users
    except (FileNotFoundError, json.JSONDecodeError):
        print("❌ Surveillance: User database not found or unreadable.")
        return []


def _build_known_faces(users: list) -> tuple:
    encodings, names = [], []
    for user in users:
        enc = user.get("encoding")
        if enc:
            encodings.append(np.array(enc))
            names.append(user.get("name", "Unknown"))
    return encodings, names


def load_known_faces() -> KnownFaces:
    """Load faces once and return a populated KnownFaces instance."""
    known = KnownFaces()
    users = _load_raw_users()
    known.update(*_build_known_faces(users))
    return known


def start_reload_thread(known: KnownFaces) -> threading.Thread:
    """
    Spawn a daemon thread that refreshes *known* every USER_RELOAD_INTERVAL seconds.
    Returns the thread (already started).
    """
    def _reload_loop():
        while True:
            time.sleep(USER_RELOAD_INTERVAL)
            try:
                users = _load_raw_users()
                known.update(*_build_known_faces(users))
                print("✅ Surveillance: Known faces reloaded.")
            except Exception as e:
                print(f"❌ Surveillance: Error reloading faces: {e}")

    t = threading.Thread(target=_reload_loop, daemon=True)
    t.start()
    return t