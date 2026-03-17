# config/settings.py
# Central configuration — change paths and constants here

USER_DB_FILE = "user_db_test.json"
ROLE_FILE = "roles_test.json"
ACCESS_LOG_FILE = "access_log_test.csv"
KNOWN_FACES_DIR = "known_faces_test"

VAULT_EXPIRY_SECONDS = 60

DEFAULT_ROLES = {
    "admin":    {"gate1": True,  "gate2": True,  "vault": True},
    "employee": {"gate1": True,  "gate2": False, "vault": False},
    "visitor":  {"gate1": True,  "gate2": False, "vault": False},
}