"""
routes/user_routes.py
----------------------
CRUD endpoints for users: register, list, edit, delete.
"""

from flask import Blueprint, request, jsonify

from models.database import load_user_db, save_user_db, load_users_safe
from services.registration_service import register_user
from security_utils import hash_password
from utils.image_utils import base64_to_tempfile

user_bp = Blueprint("user", __name__)


@user_bp.route("/api/users", methods=["GET"])
def get_users():
    try:
        users = load_users_safe()
        # Only send what the frontend needs — exclude large encodings
        return jsonify([{"name": u["name"], "role": u["role"]} for u in users])
    except Exception as e:
        return jsonify({"message": f"❌ Error fetching users: {e}"}), 500


@user_bp.route("/api/users", methods=["POST"])
def register_user_route():
    data = request.get_json()
    name     = data.get("name")
    role     = data.get("role")
    password = data.get("password")
    b64_img  = data.get("image")

    if not all([name, role, password, b64_img]):
        return jsonify({"message": "❌ Missing required fields"}), 400

    # Reject duplicates before doing any image work
    if any(u["name"] == name for u in load_user_db()):
        return jsonify({"message": f'❌ User "{name}" already exists'}), 400

    try:
        with base64_to_tempfile(b64_img) as path:
            message = register_user(name, role, password, path)
        return jsonify({"message": message})

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": f"❌ Error: {e}"}), 500


@user_bp.route("/api/users/<username>", methods=["PUT"])
def edit_user(username):
    data     = request.get_json()
    new_role = data.get("role")
    new_pass = data.get("password")

    if not new_role:
        return jsonify({"message": "❌ Missing role field"}), 400

    try:
        users = load_user_db()
        for user in users:
            if user["name"] == username:
                user["role"] = new_role
                if new_pass and new_pass != "********":
                    user["password"] = hash_password(new_pass)
                save_user_db(users)
                return jsonify({"message": f"User '{username}' updated successfully."})

        return jsonify({"message": f"User '{username}' not found."}), 404

    except Exception as e:
        return jsonify({"message": f"❌ Error updating user: {e}"}), 500


@user_bp.route("/api/users/<username>", methods=["DELETE"])
def delete_user(username):
    try:
        users = load_user_db()
        updated = [u for u in users if u["name"] != username]

        if len(updated) == len(users):
            return jsonify({"message": f"User '{username}' not found."}), 404

        save_user_db(updated)
        return jsonify({"message": f"User '{username}' deleted successfully."})

    except Exception as e:
        return jsonify({"message": f"❌ Error deleting user: {e}"}), 500