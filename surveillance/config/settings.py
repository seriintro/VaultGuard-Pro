# surveillance/config/settings.py
# All tunable constants for the surveillance module in one place.

USER_DB_FILE       = "user_db_test.json"
UNKNOWN_VIDEOS_DIR = "unknown_videos"

# Recording behaviour
BUFFER_SECONDS         = 2.0    # Pre-detection frame buffer
POST_DETECTION_SECONDS = 3.0    # Extra seconds to record after detection
FPS_ESTIMATE           = 30     # Camera FPS estimate (used to size the frame buffer)
RECORDING_FPS          = 20     # FPS used when writing the video file
MIN_FRAMES_FOR_VIDEO   = 10     # Discard recordings shorter than this

# Cooldown between repeat log entries for the same person (seconds)
COOLDOWN_SECONDS = 10

# How often to refresh the known-faces list from the database (seconds)
USER_RELOAD_INTERVAL = 300  # 5 minutes

# ── Performance tuning ────────────────────────────────────────────────────────

# Run face recognition only on every Nth frame; annotate all frames with the
# last known result. Higher = faster stream, slightly stale labels.
PROCESS_EVERY_N_FRAMES = 3

# Detection model: 'cnn' is more accurate; 'hog' is faster on CPU
DETECTION_MODEL = "cnn"

# Distance threshold for face matching (lower = stricter).
# 0.6 is the face_recognition library default; 0.55 reduces false positives.
FACE_RECOGNITION_TOLERANCE = 0.55