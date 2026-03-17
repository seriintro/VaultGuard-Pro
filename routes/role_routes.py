"""
routes/role_routes.py
----------------------
CRUD endpoints for roles and role assignment.
"""

from flask import Blueprint, request, jsonify

from models.database import load_roles, save_roles, load_users_safe
from services.rbac_service import create_role, assign_role_to_user

role_bp = Blueprint("role", __name__)


@role_bp.route("/api/roles", methods=["GET"])
def get_roles():
    return jsonify(load_roles())


@role_bp.route("/api/roles", methods=["POST"])
def add_role():
    data = request.get_json()
    message = create_role(
        role_name=data.get("role"),
        permission_flags=data.get("permissions", []),
    )
    return jsonify({"message": message})


@role_bp.route("/api/roles/<role_name>", methods=["DELETE"])
def delete_role(role_name):
    try:
        roles = load_roles()

        if role_name not in roles:
            return jsonify({"message": f"Role '{role_name}' not found."}), 404

        # Prevent deletion if any user still carries this role
        users = load_users_safe()
        affected = [u["name"] for u in users if u["role"] == role_name]
        if affected:
            return jsonify({
                "message": (
                    f"Cannot delete role '{role_name}' — "
                    f"still assigned to: {', '.join(affected)}"
                ),
                "users_affected": affected,
            }), 400

        del roles[role_name]
        save_roles(roles)
        return jsonify({"message": f"Role '{role_name}' deleted successfully."})

    except Exception as e:
        return jsonify({"message": f"❌ Error deleting role: {e}"}), 500


@role_bp.route("/api/assign-role", methods=["POST"])
def assign_role():
    data = request.get_json()
    username  = data.get("username")
    role_name = data.get("role")
    message = assign_role_to_user(username, role_name)
    return jsonify({"message": message})