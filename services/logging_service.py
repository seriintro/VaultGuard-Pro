"""
services/logging_service.py
----------------------------
Writes access events to the CSV log and provides a pretty-print viewer.
"""

import csv
import os
from datetime import datetime

from config.settings import ACCESS_LOG_FILE

_HEADERS = ["name", "role", "time", "gate", "status"]


def log_access(name: str, role: str, gate: str, status: str) -> None:
    """Append one access event to the CSV log."""
    time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    write_header = (
        not os.path.exists(ACCESS_LOG_FILE)
        or os.path.getsize(ACCESS_LOG_FILE) == 0
    )

    with open(ACCESS_LOG_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        if write_header:
            writer.writerow(_HEADERS)
        writer.writerow([name, role, time_now, gate, status])


def view_logs() -> None:
    """Print a formatted table of all access log entries."""
    try:
        with open(ACCESS_LOG_FILE, mode="r") as f:
            reader = csv.DictReader(f)
            print("\n📋 Access Logs:")
            print("-" * 70)
            print(f"{'Name':<20} {'Role':<10} {'Gate':<10} {'Status':<10} {'Time'}")
            print("-" * 70)
            for row in reader:
                print(
                    f"{row['name']:<20} {row['role']:<10} "
                    f"{row['gate']:<10} {row['status']:<10} {row['time']}"
                )
            print("-" * 70)
    except FileNotFoundError:
        print("❌ No access logs found yet.")