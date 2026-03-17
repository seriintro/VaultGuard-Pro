"""
models/database.py
------------------
Low-level read/write helpers for the user and role JSON stores.
All caching logic lives here so nothing else has to worry about it.
"""

import json
import os

from config.settings import USER_DB_FILE, ROLE_FILE, DEFAULT_ROLES
from security_utils import decrypt_data

# ── private cache state ───────────────────────────────────────────────────────
_user_db_cache = None
_user_db_last_modified = 0

_roles_cache = None
_roles_last_modified = 0


# ── User DB ───────────────────────────────────────────────────────────────────

def load_user_db() -> list:
    """Return all users from disk (with in-memory cache)."""
    global _user_db_cache, _user_db_last_modified

    if not os.path.exists(USER_DB_FILE):
        return []

    current_mtime = os.path.getmtime(USER_DB_FILE)
    if _user_db_cache is not None and current_mtime <= _user_db_last_modified:
        return _user_db_cache.copy()

    try:
        with open(USER_DB_FILE, "r") as f:
            _user_db_cache = json.load(f)
            _user_db_last_modified = current_mtime
            return _user_db_cache.copy()
    except json.JSONDecodeError:
        print("Warning: User database corrupted, resetting.")
        _user_db_cache = []
        return []
    except Exception as e:
        print(f"Error loading user database: {e}")
        return [] if _user_db_cache is None else _user_db_cache.copy()


def save_user_db(users: list) -> None:
    """Persist users to disk and refresh cache."""
    global _user_db_cache, _user_db_last_modified

    try:
        with open(USER_DB_FILE, "w") as f:
            json.dump(users, f, indent=4)
        _user_db_cache = users.copy()
        _user_db_last_modified = os.path.getmtime(USER_DB_FILE)
    except Exception as e:
        print(f"Error saving user database: {e}")


def load_users_safe() -> list:
    """
    Load users with passwords masked and image paths decrypted.
    Use this for display/admin purposes — never for authentication.
    """
    users = load_user_db()
    safe = []
    for user in users:
        u = dict(user)
        u["password"] = "********"
        if u.get("image_path", "").startswith("gAAAAAB"):
            try:
                u["image_path"] = decrypt_data(u["image_path"])
            except Exception:
                pass
        safe.append(u)
    return safe


def save_users_preserving_secrets(users: list) -> None:
    """
    Save users coming from an admin UI where passwords are masked.
    Restores original hashed passwords and encrypted image paths.
    """
    if not os.path.exists(USER_DB_FILE):
        save_user_db(users)
        return

    with open(USER_DB_FILE, "r") as f:
        originals = {u["name"]: u for u in json.load(f)}

    for user in users:
        original = originals.get(user["name"], {})
        if user.get("password") == "********" and "password" in original:
            user["password"] = original["password"]
        if original.get("image_path", "").startswith("gAAAAAB"):
            user["image_path"] = original["image_path"]

    save_user_db(users)


# ── Role DB ───────────────────────────────────────────────────────────────────

def load_roles() -> dict:
    """Return role permissions from disk (with in-memory cache)."""
    global _roles_cache, _roles_last_modified

    if not os.path.exists(ROLE_FILE):
        _initialise_role_file()

    current_mtime = os.path.getmtime(ROLE_FILE)
    if _roles_cache is not None and current_mtime <= _roles_last_modified:
        return _roles_cache.copy()

    try:
        with open(ROLE_FILE, "r") as f:
            _roles_cache = json.load(f)
            _roles_last_modified = current_mtime
            return _roles_cache.copy()
    except Exception as e:
        print(f"Error loading roles: {e}")
        return {} if _roles_cache is None else _roles_cache.copy()


def save_roles(roles: dict) -> None:
    """Persist roles to disk and refresh cache."""
    global _roles_cache, _roles_last_modified

    try:
        with open(ROLE_FILE, "w") as f:
            json.dump(roles, f, indent=4)
        _roles_cache = roles.copy()
        _roles_last_modified = os.path.getmtime(ROLE_FILE)
    except Exception as e:
        print(f"Error saving roles: {e}")


def _initialise_role_file() -> None:
    with open(ROLE_FILE, "w") as f:
        json.dump(DEFAULT_ROLES, f, indent=4)