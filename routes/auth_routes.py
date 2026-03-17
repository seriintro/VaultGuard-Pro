"""
routes/auth_routes.py
----------------------
Login / session-check endpoints.

POST /api/auth/login  — public, returns JWT token
GET  /api/auth/me     — protected, validates token and returns user info
"""

from flask import Blueprint, request, jsonify

from services.auth_service import login, verify_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/auth/login", methods=["POST"])
def user_login():
    """
    Authenticate using name + password from the user database.
    Only admin-role users can log in to the dashboard.

    Request:  { "username": "admin", "password": "..." }
    Response: { "token": "...", "name": "admin", "role": "admin" }
    """
    data     = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"message": "❌ Username and password are required."}), 400

    token, user_info, error = login(username, password)

    if error:
        return jsonify({"message": f"❌ {error}"}), 401

    return jsonify({
        "message": "✅ Login successful.",
        "token":   token,
        "name":    user_info["name"],
        "role":    user_info["role"],
    })


@auth_bp.route("/api/auth/me", methods=["GET"])
def me():
    """
    Validate a token and return the current user info.
    Used by the frontend to restore session on page refresh.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"message": "❌ No token provided."}), 401

    token = auth_header.split(" ", 1)[1]
    try:
        payload = verify_token(token)
        return jsonify({"name": payload["sub"], "role": payload["role"]})
    except Exception:
        return jsonify({"message": "❌ Invalid or expired token."}), 401