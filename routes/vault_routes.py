"""
routes/vault_routes.py
-----------------------
Two-person vault authentication endpoint.
"""

from flask import Blueprint, request, jsonify

from services.access_service import vault_authentication
from utils.image_utils import base64_to_tempfile

vault_bp = Blueprint("vault", __name__)


@vault_bp.route("/api/vault-access", methods=["POST"])
def vault_access():
    data = request.get_json()

    if "image" not in data:
        return jsonify({"message": "❌ No image provided", "status": "failed"}), 400

    try:
        with base64_to_tempfile(data["image"]) as path:
            result, status, user = vault_authentication(
                path,
                password=data.get("password"),
            )

        response = {"message": result, "status": status}
        if user:
            response["user"] = user["name"]
        return jsonify(response)

    except ValueError as e:
        return jsonify({"message": str(e), "status": "failed"}), 400
    except Exception as e:
        return jsonify({"message": f"❌ Error: {e}", "status": "failed"}), 500