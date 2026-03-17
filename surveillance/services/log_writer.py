"""
surveillance/services/log_writer.py
-------------------------------------
Thin helper that appends a dict to a JSON-array log file.
Kept separate so both the recorder and the live feed can use it
without importing each other.
"""

import json


def append_to_json_file(filename: str, log_data: dict) -> None:
    """Append *log_data* to the JSON array stored in *filename*."""
    try:
        with open(filename, "r") as f:
            logs = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        logs = []

    logs.append(log_data)

    with open(filename, "w") as f:
        json.dump(logs, f, indent=2)