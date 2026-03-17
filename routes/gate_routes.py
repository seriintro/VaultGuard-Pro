"""
routes/gate_routes.py
----------------------
Gate 1 (face only) and Gate 2 (face + password) HTTP endpoints.
"""

from flask import Blueprint, request, jsonify

from services.access_service import (
    recognize_face_gate1,
    recognize_face_and_password_gate2,
)
from utils.image_utils import base64_to_tempfile

gate_bp = Blueprint("gate", __name__)


@gate_bp.route("/api/gate1-access", methods=["POST"])
def gate1_access():
    data = request.get_json()

    if "image" not in data:
        return jsonify({"message": "❌ No image provided", "access": False}), 400

    try:
        with base64_to_tempfile(data["image"]) as path:
            result, user = recognize_face_gate1(path)

        return jsonify({
            "message": result,
            "access": "✅ Access Granted" in result,
            "user": user["name"] if user else None,
        })

    except ValueError as e:
        return jsonify({"message": str(e), "access": False}), 400
    except Exception as e:
        return jsonify({"message": f"❌ Error: {e}", "access": False}), 500


@gate_bp.route("/api/gate2-access", methods=["POST"])
def gate2_access():
    data = request.get_json()

    if "image" not in data:
        return jsonify({"message": "❌ No image provided", "access": False}), 400
    if "password" not in data:
        return jsonify({"message": "❌ No password provided", "access": False}), 400

    try:
        with base64_to_tempfile(data["image"]) as path:
            result = recognize_face_and_password_gate2(path, data["password"])

        return jsonify({
            "message": result,
            "access": "✅ Access Granted" in result,
        })

    except ValueError as e:
        return jsonify({"message": str(e), "access": False}), 400
    except Exception as e:
        return jsonify({"message": f"❌ Error: {e}", "access": False}), 500