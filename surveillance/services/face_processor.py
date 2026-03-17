"""
surveillance/services/face_processor.py
-----------------------------------------
Stateless face-recognition helper.
Takes a raw frame and a KnownFaces snapshot; returns labelled detections.
Keeping this separate makes it easy to unit-test without a camera.
"""

import cv2
import face_recognition
import numpy as np


def process_frame(frame, known_encodings: list, known_names: list) -> list:
    """
    Detect and identify faces in *frame*.

    Returns a list of dicts:
        {
          "name":   str,          # recognised name or "Unknown"
          "top":    int,          # bounding-box coordinates (original scale)
          "right":  int,
          "bottom": int,
          "left":   int,
        }
    """
    # Downscale for speed, convert to RGB
    small = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_small = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)

    locations = face_recognition.face_locations(rgb_small)
    encodings = face_recognition.face_encodings(rgb_small, locations)

    results = []
    for enc, (top, right, bottom, left) in zip(encodings, locations):
        name = "Unknown"
        if known_encodings:
            matches = face_recognition.compare_faces(known_encodings, enc)
            if True in matches:
                name = known_names[matches.index(True)]

        results.append({
            "name":   name,
            "top":    top * 4,
            "right":  right * 4,
            "bottom": bottom * 4,
            "left":   left * 4,
        })

    return results


def annotate_frame(frame, detections: list) -> None:
    """Draw bounding boxes and name labels onto *frame* in-place."""
    for d in detections:
        color = (0, 255, 0) if d["name"] != "Unknown" else (0, 0, 255)
        top, right, bottom, left = d["top"], d["right"], d["bottom"], d["left"]

        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
        cv2.putText(
            frame, d["name"],
            (left + 6, bottom - 6),
            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 1,
        )