"""
main.py
-------
Application entry point — initialises the role database and shows a quick
summary. Replace the body of main() with your UI / CLI loop as needed.
"""

from models.database import load_roles, _initialise_role_file
from services.rbac_service import view_roles, view_users
from config.settings import ROLE_FILE
import os


def main():
    # Ensure the role database exists with sensible defaults
    if not os.path.exists(ROLE_FILE):
        _initialise_role_file()

    view_roles()
    view_users()


if __name__ == "__main__":
    main()