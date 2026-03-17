"""
services/rbac_service.py
-------------------------
Role-Based Access Control management — create roles, assign to users, view state.
"""

from models.database import (
    load_roles, save_roles,
    load_user_db, save_user_db,
    load_users_safe,
)


# ── Roles ─────────────────────────────────────────────────────────────────────

def create_role(role_name: str, permission_flags: list) -> str:
    """
    Create a new role with the given permissions.

    permission_flags may contain: 'access_gate1', 'access_gate2', 'access_vault'.
    """
    roles = load_roles()
    if role_name in roles:
        return f"❌ Role '{role_name}' already exists."

    roles[role_name] = {
        "gate1": "access_gate1" in permission_flags,
        "gate2": "access_gate2" in permission_flags,
        "vault": "access_vault" in permission_flags,
    }
    save_roles(roles)
    return f"✅ Role '{role_name}' created with permissions: {roles[role_name]}"


def delete_role(role_name: str) -> str:
    roles = load_roles()
    if role_name not in roles:
        return f"❌ Role '{role_name}' does not exist."
    del roles[role_name]
    save_roles(roles)
    return f"✅ Role '{role_name}' deleted."


def update_role_permissions(role_name: str, permission_flags: list) -> str:
    roles = load_roles()
    if role_name not in roles:
        return f"❌ Role '{role_name}' does not exist."

    roles[role_name] = {
        "gate1": "access_gate1" in permission_flags,
        "gate2": "access_gate2" in permission_flags,
        "vault": "access_vault" in permission_flags,
    }
    save_roles(roles)
    return f"✅ Role '{role_name}' updated: {roles[role_name]}"


# ── User ↔ Role ───────────────────────────────────────────────────────────────

def assign_role_to_user(username: str, role_name: str) -> str:
    roles = load_roles()
    if role_name not in roles:
        return "❌ Role does not exist."

    users = load_user_db()
    for user in users:
        if user["name"] == username:
            user["role"] = role_name
            save_user_db(users)
            return f"✅ Role '{role_name}' assigned to {username}."

    return "❌ User not found."


# ── Display helpers ───────────────────────────────────────────────────────────

def view_roles() -> None:
    roles = load_roles()
    users = load_users_safe()

    print("\n📋 Available Roles and Access Permissions:")
    if not roles:
        print("  No roles found.")
    else:
        for role, permissions in roles.items():
            granted = [k for k, v in permissions.items() if v]
            print(f"  - {role}: {', '.join(granted) if granted else 'no permissions'}")

    print("\n👥 Users and Their Roles:")
    if not users:
        print("  No users found.")
    else:
        for user in users:
            print(f"  - {user['name']} → {user['role']}")


def view_users() -> None:
    users = load_users_safe()
    print("\n👥 Registered Users:")
    if not users:
        print("  No users found.")
    else:
        for user in users:
            print(f"  - {user['name']} ({user['role']})")