"""
services/registration_service.py
----------------------------------
Handles registering permanent users and temporary visitors.
"""

import os

import face_recognition
from security_utils import hash_password, encrypt_data

from config.settings import KNOWN_FACES_DIR
from models.database import load_user_db, save_user_db

os.makedirs(KNOWN_FACES_DIR, exist_ok=True)


def register_user(name: str, role: str, password: str, image_path: str) -> str:
    """Register a new employee / admin user with face + password."""
    users = load_user_db()

    if any(u["name"] == name for u in users):
        return f"❌ User '{name}' already exists."

    try:
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        if not encodings:
            return "❌ No face detected in image."

        face_encoding = encodings[0]

        # Persist face image
        saved_image_path = os.path.join(
            KNOWN_FACES_DIR,
            f"{name.lower().replace(' ', '_')}.jpg",
        )
        with open(image_path, "rb") as src, open(saved_image_path, "wb") as dst:
            dst.write(src.read())

        users.append({
            "name": name,
            "role": role,
            "password": hash_password(password),
            "image_path": encrypt_data(saved_image_path),
            "encoding": face_encoding.tolist(),
        })
        save_user_db(users)
        return f"✅ User '{name}' registered successfully!"

    except Exception as e:
        return f"❌ Error registering user: {e}"


def register_visitor(name: str, purpose: str, image_path: str) -> str:
    """Register a one-off visitor (Gate 1 only, generic password)."""
    try:
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        if not encodings:
            return "❌ No face found in the image."

        saved_image_path = os.path.join(KNOWN_FACES_DIR, f"visitor_{name}.jpg")
        with open(image_path, "rb") as src, open(saved_image_path, "wb") as dst:
            dst.write(src.read())

        users = load_user_db()
        users.append({
            "name": name,
            "role": "visitor",
            "password": hash_password("visitor"),
            "purpose": purpose,
            "image_path": encrypt_data(saved_image_path),
            "encoding": encodings[0].tolist(),
        })
        save_user_db(users)
        return f"✅ Visitor '{name}' registered successfully for '{purpose}'."

    except Exception as e:
        return f"❌ Error registering visitor: {e}"