import os
import json
import base64
import bcrypt
import threading
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Constants
USER_DB_FILE = "user_db_test.json"
KEY_FILE = "secure.key"  # File to store the encryption key

# Lock for thread safety during file operations
db_lock = threading.Lock()

# Cache for encryption key to avoid repeated file I/O
_key_cache = None

# Generate or load encryption key with caching
def get_encryption_key():
    global _key_cache
    
    if _key_cache is not None:
        return _key_cache
        
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as f:
            _key_cache = f.read()
            return _key_cache
    else:
        # Generate a secure key
        salt = os.urandom(16)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(b"secure_access_control_system"))
        
        # Save the key
        with open(KEY_FILE, "wb") as f:
            f.write(key)
        
        _key_cache = key
        return key

# Create Fernet cipher with our key - memoized for performance
_cipher_instance = None
def get_cipher():
    global _cipher_instance
    
    if _cipher_instance is None:
        key = get_encryption_key()
        _cipher_instance = Fernet(key)
    
    return _cipher_instance

# Hash a password
def hash_password(password):
    # Generate a salt and hash the password
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=10)  # Lower rounds for better performance
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')  # Store as string

# Verify a password
def verify_password(stored_hash, provided_password):
    stored_bytes = stored_hash.encode('utf-8')
    provided_bytes = provided_password.encode('utf-8')
    return bcrypt.checkpw(provided_bytes, stored_bytes)

# Encrypt data with error handling
def encrypt_data(data):
    if not data:
        return ""
        
    if isinstance(data, str) and data.startswith("gAAAAAB"):
        # Already encrypted, don't double-encrypt
        return data
        
    try:
        cipher = get_cipher()
        return cipher.encrypt(data.encode('utf-8')).decode('utf-8')
    except Exception as e:
        print(f"Encryption error: {str(e)}")
        return data  # Return original if encryption fails

# Decrypt data with error handling
def decrypt_data(encrypted_data):
    if not encrypted_data:
        return ""
        
    if not isinstance(encrypted_data, str) or not encrypted_data.startswith("gAAAAAB"):
        # Not encrypted or invalid format
        return encrypted_data
        
    try:
        cipher = get_cipher()
        return cipher.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')
    except Exception as e:
        print(f"Decryption error: {str(e)}")
        return encrypted_data  # Return encrypted version if decryption fails

# Update existing user database to secure format - run in background thread
def secure_existing_database():
    # Only run if file exists
    if not os.path.exists(USER_DB_FILE):
        return
    
    def background_task():
        with db_lock:
            try:
                with open(USER_DB_FILE, "r") as f:
                    users = json.load(f)
                
                updated = False
                for user in users:
                    # Check if password is already hashed (bcrypt hashes start with $2b$)
                    if "password" in user and user["password"] and not user["password"].startswith("$2b$"):
                        user["password"] = hash_password(user["password"])
                        updated = True
                        
                    # Check if image_path needs encryption
                    if "image_path" in user and user["image_path"] and not user["image_path"].startswith("gAAAAAB"):
                        try:
                            user["image_path"] = encrypt_data(user["image_path"])
                            updated = True
                        except Exception:
                            # Already encrypted or invalid format
                            pass
                
                if updated:
                    with open(USER_DB_FILE, "w") as f:
                        json.dump(users, f, indent=4)
                    print("✅ Existing database secured successfully")
            except Exception as e:
                print(f"Error securing database: {str(e)}")
    
    # Run in background to avoid blocking imports
    threading.Thread(target=background_task).start()

# Initialize security when module is imported
secure_existing_database()