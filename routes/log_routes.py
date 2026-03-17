"""
routes/log_routes.py
---------------------
Read-only endpoints for access logs and surveillance logs.
"""

import csv
import json
import os

from flask import Blueprint, jsonify

from config.settings import ACCESS_LOG_FILE

log_bp = Blueprint("log", __name__)

_SURVEILLANCE_RECOGNIZED_FILE  = "recognized_log_test.json"
_SURVEILLANCE_UNRECOGNIZED_FILE = "unknown_log_test.json"


@log_bp.route("/api/access-logs", methods=["GET"])
def get_access_logs():
    if not os.path.exists(ACCESS_LOG_FILE):
        return jsonify({"message": "No access logs found."}), 404

    try:
        with open(ACCESS_LOG_FILE, mode="r") as f:
            logs = list(csv.DictReader(f))
    except Exception as e:
        return jsonify({"message": f"Error reading access logs: {e}"}), 500

    if not logs:
        return jsonify({"message": "No access logs found."}), 404

    return jsonify(logs)


@log_bp.route("/api/surveillance-logs", methods=["GET"])
def get_surveillance_logs():
    logs = {"recognized": [], "unrecognized": []}

    for key, filepath in [
        ("recognized",   _SURVEILLANCE_RECOGNIZED_FILE),
        ("unrecognized", _SURVEILLANCE_UNRECOGNIZED_FILE),
    ]:
        try:
            with open(filepath, "r") as f:
                logs[key] = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Could not read {filepath}: {e}")

    return jsonify(logs)