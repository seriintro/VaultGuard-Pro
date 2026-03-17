"""
services/access_service.py
---------------------------
Gate 1 (face only), Gate 2 (face + password), and Vault (two-person auth).
"""

import numpy as np
import face_recognition
from datetime import datetime, timedelta

from security_utils import verify_password

from config.settings import VAULT_EXPIRY_SECONDS
from models.database import load_user_db, load_roles
from services.logging_service import log_access


# ── Gate 1 — face recognition ─────────────────────────────────────────────────

def recognize_face_gate1(image_path: str) -> tuple:
    """
    Returns (message, user_dict | None).
    Access is granted when the recognised role has gate1 permission.
    """
    unknown_image = face_recognition.load_image_file(image_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)

    if not unknown_encodings:
        return "❌ No face detected.", None

    unknown_encoding = unknown_encodings[0]
    users = load_user_db()
    roles = load_roles()

    for user in users:
        known_encoding = np.array(user["encoding"])
        if face_recognition.compare_faces([known_encoding], unknown_encoding)[0]:
            role = user["role"]
            if roles.get(role, {}).get("gate1", False):
                log_access(user["name"], role, "Gate 1", "Granted")
                return f"✅ Access Granted to {user['name']} ({role})", user
            else:
                log_access(user["name"], role, "Gate 1", "Denied")
                return f"❌ Access Denied: {role}s are not allowed at Gate 1.", None

    log_access("Unknown", "Unknown", "Gate 1", "Denied")
    return "❌ Access Denied: Face not recognized.", None


# ── Gate 2 — face + password (MFA) ───────────────────────────────────────────

def recognize_face_and_password_gate2(image_path: str, entered_password: str) -> str:
    """Returns a status message. Access requires face match + correct password + gate2 role permission."""
    unknown_image = face_recognition.load_image_file(image_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)

    if not unknown_encodings:
        return "❌ No face detected."

    unknown_encoding = unknown_encodings[0]
    users = load_user_db()

    for user in users:
        known_encoding = np.array(user["encoding"])
        if face_recognition.compare_faces([known_encoding], unknown_encoding)[0]:
            if not verify_password(user["password"], entered_password):
                log_access(user["name"], user["role"], "Gate 2", "Denied (Incorrect Password)")
                return "❌ Access Denied: Incorrect password."

            roles = load_roles()
            if roles.get(user["role"], {}).get("gate2", False):
                log_access(user["name"], user["role"], "Gate 2", "Granted")
                return f"✅ Access Granted to {user['name']} ({user['role']}) via Gate 2"
            else:
                log_access(user["name"], user["role"], "Gate 2", "Denied (No Permission)")
                return f"❌ Access Denied: {user['role']} does not have access to Gate 2."

    log_access("Unknown", "Unknown", "Gate 2", "Denied")
    return "❌ Access Denied: Face not recognized."


# ── Vault — two-person authentication ────────────────────────────────────────

# Module-level state for the two-person handshake
_PENDING_VAULT_AUTH: dict = {
    "pending_user": None,
    "timestamp": None,
}


def vault_authentication(image_path: str, password: str = None) -> tuple:
    """
    Two-person vault authentication.

    Returns (message, status, user_dict | None).
    status is one of: 'waiting', 'success', 'failed'.

    Both users must authenticate within VAULT_EXPIRY_SECONDS of each other.
    """
    unknown_image = face_recognition.load_image_file(image_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)

    if not unknown_encodings:
        return "❌ No face detected.", "failed", None

    unknown_encoding = unknown_encodings[0]
    users = load_user_db()
    roles = load_roles()

    # ── Identify the person ───────────────────────────────────────────────────
    matched_user = None
    for user in users:
        known_encoding = np.array(user["encoding"])
        if face_recognition.compare_faces([known_encoding], unknown_encoding)[0]:
            matched_user = user
            break

    if not matched_user:
        log_access("Unknown", "Unknown", "Vault", "Denied")
        return "❌ Access Denied: Face not recognized.", "failed", None

    # ── Password check ────────────────────────────────────────────────────────
    if not password or not verify_password(matched_user["password"], password):
        log_access(matched_user["name"], matched_user["role"], "Vault", "Denied (Incorrect Password)")
        return "❌ Access Denied: Incorrect password.", "failed", matched_user

    # ── Role permission check ─────────────────────────────────────────────────
    if not roles.get(matched_user["role"], {}).get("vault", False):
        log_access(matched_user["name"], matched_user["role"], "Vault", "Denied (No Permission)")
        return (
            f"❌ Access Denied: {matched_user['role']} does not have vault access permission.",
            "failed",
            matched_user,
        )

    current_time = datetime.now()

    # ── First person ──────────────────────────────────────────────────────────
    if _PENDING_VAULT_AUTH["pending_user"] is None:
        _PENDING_VAULT_AUTH["pending_user"] = matched_user["name"]
        _PENDING_VAULT_AUTH["timestamp"] = current_time
        log_access(matched_user["name"], matched_user["role"], "Vault", "First Authentication")
        return (
            f"✅ First authentication successful. Waiting for second person. "
            f"(Expires in {VAULT_EXPIRY_SECONDS} seconds)",
            "waiting",
            matched_user,
        )

    # ── Check expiry ──────────────────────────────────────────────────────────
    expiry_time = _PENDING_VAULT_AUTH["timestamp"] + timedelta(seconds=VAULT_EXPIRY_SECONDS)
    if current_time > expiry_time:
        # Restart with this user as first
        _PENDING_VAULT_AUTH["pending_user"] = matched_user["name"]
        _PENDING_VAULT_AUTH["timestamp"] = current_time
        log_access(matched_user["name"], matched_user["role"], "Vault", "First Authentication (Previous Expired)")
        return (
            f"✅ First authentication successful. Waiting for second person. "
            f"(Expires in {VAULT_EXPIRY_SECONDS} seconds)",
            "waiting",
            matched_user,
        )

    # ── Prevent same-person double auth ───────────────────────────────────────
    if _PENDING_VAULT_AUTH["pending_user"] == matched_user["name"]:
        return "❌ Cannot authenticate twice. Need a different authorized person.", "failed", matched_user

    # ── Second person — grant access ──────────────────────────────────────────
    first_user = _PENDING_VAULT_AUTH["pending_user"]
    _PENDING_VAULT_AUTH["pending_user"] = None
    _PENDING_VAULT_AUTH["timestamp"] = None

    log_access(matched_user["name"], matched_user["role"], "Vault", "Second Authentication")
    log_access(f"{first_user} + {matched_user['name']}", matched_user["role"], "Vault", "Access Granted")

    return (
        f"✅ Vault Access Granted! Authenticated by {first_user} and {matched_user['name']}",
        "success",
        matched_user,
    )