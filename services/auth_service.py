"""
services/auth_service.py
--------------------------
Login authentication using the existing user database (user_db_test.json).

- Username  = the user's "name" field in the database
- Password  = the bcrypt-hashed "password" field set during registration
- On success, returns a signed JWT containing the user's name and role
- The role is embedded in the token so the frontend can show/hide UI elements

No separate admin database is needed — everyone registered in the system
can log in with the credentials they were registered with.
"""

import datetime

import jwt

from security_utils import verify_password, hash_password
from models.database import load_user_db, save_user_db

# ── JWT config ────────────────────────────────────────────────────────────────

JWT_SECRET = "access-control-system-secret-key-2024"

JWT_ALGORITHM    = "HS256"
JWT_EXPIRY_HOURS = 8


# ── Token helpers ─────────────────────────────────────────────────────────────

def generate_token(name: str, role: str) -> str:
    """Create a signed JWT embedding the user's name and role."""
    payload = {
        "sub":  name,
        "role": role,
        "iat":  datetime.datetime.utcnow(),
        "exp":  datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    Returns the payload dict on success.
    Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError on failure.
    """
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])


# ── Login ─────────────────────────────────────────────────────────────────────

def login(username: str, password: str) -> tuple:
    """
    Authenticate against the user database.

    Matches by name (case-insensitive) and verifies the bcrypt password.
    Returns (token, user_info, None) on success.
    Returns (None, None, error_message) on failure.

    user_info = { "name": str, "role": str }
    """
    if not username or not password:
        return None, None, "Username and password are required."

    users = load_user_db()

    # Case-insensitive name match
    matched = next(
        (u for u in users if u["name"].lower() == username.strip().lower()),
        None,
    )

    # Use the same generic error for wrong name or wrong password
    # — prevents leaking which usernames exist
    if not matched or not verify_password(matched["password"], password):
        return None, None, "Invalid username or password."

    # Only admin role can access the dashboard
    if matched["role"] != "admin":
        return None, None, "Access restricted to admins only."

    token = generate_token(matched["name"], matched["role"])
    user_info = {
        "name": matched["name"],
        "role": matched["role"],
    }
    return token, user_info, None


# ── Password change ───────────────────────────────────────────────────────────

def change_password(username: str, old_password: str, new_password: str) -> tuple:
    """
    Allow a logged-in user to change their own password.
    Returns (True, message) or (False, error).
    """
    if len(new_password) < 8:
        return False, "New password must be at least 8 characters."

    users = load_user_db()
    for user in users:
        if user["name"].lower() == username.lower():
            if not verify_password(user["password"], old_password):
                return False, "Current password is incorrect."
            user["password"] = hash_password(new_password)
            save_user_db(users)
            return True, "Password changed successfully."

    return False, "User not found."


# ── Compatibility stub (called from app.py at startup) ───────────────────────

def seed_default_admin() -> None:
    """
    No-op — kept so app.py doesn't need changes.
    Users are registered through /api/users; no separate seeding needed.
    """
    pass