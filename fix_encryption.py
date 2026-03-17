"""
fix_encryption.py
------------------
One-time script to re-encrypt any image_path values that were encrypted
with an old key. Run this once from your project root, then delete it.

Usage: python fix_encryption.py
"""

import json
import os
from security_utils import decrypt_data, encrypt_data

USER_DB_FILE = "user_db_test.json"
KNOWN_FACES_DIR = "known_faces_test"

with open(USER_DB_FILE, "r") as f:
    users = json.load(f)

fixed = 0
for user in users:
    ip = user.get("image_path", "")
    if not ip:
        continue

    # Try to decrypt — if it fails, the path uses an old key
    try:
        decrypted = decrypt_data(ip)
        # If decrypted path doesn't look like a real path, it may have silently failed
        if not decrypted or decrypted == ip:
            raise ValueError("Decryption returned unchanged value")
        # Re-encrypt with the current key to normalise
        user["image_path"] = encrypt_data(decrypted)
        print(f"✅ Re-encrypted image_path for '{user['name']}'")
        fixed += 1
    except Exception:
        # Old key — derive the expected file path from the name and re-encrypt that
        expected_path = os.path.join(
            KNOWN_FACES_DIR,
            f"{user['name'].lower().replace(' ', '_')}.jpg"
        )
        if os.path.exists(expected_path):
            user["image_path"] = encrypt_data(expected_path)
            print(f"✅ Fixed image_path for '{user['name']}' → {expected_path}")
            fixed += 1
        else:
            print(f"⚠️  Could not fix '{user['name']}' — image file not found at {expected_path}")

if fixed:
    with open(USER_DB_FILE, "w") as f:
        json.dump(users, f, indent=4)
    print(f"\n✅ Done — fixed {fixed} user(s). You can delete fix_encryption.py now.")
else:
    print("Nothing to fix.")