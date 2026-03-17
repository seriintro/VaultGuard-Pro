"""
app.py
-------
Application factory.
Registers all blueprints and configures CORS in one place.
Run with:  python app.py

Login flow:
  - Users registered via POST /api/users are automatically able to log in
  - Use their registered name as username and registered password
  - POST /api/auth/login → returns JWT token
  - Send token as 'Authorization: Bearer <token>' on all /api/* requests
"""

import re
from flask import Flask
from flask_cors import CORS

from routes.auth_routes  import auth_bp
from routes.gate_routes  import gate_bp
from routes.vault_routes import vault_bp
from routes.user_routes  import user_bp
from routes.role_routes  import role_bp
from routes.log_routes   import log_bp
from surveillance.routes.surveillance_routes import surveillance_bp


def create_app() -> Flask:
    app = Flask(__name__)

    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                re.compile(r"https://.*\.netlify\.app"),
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    })

    # ── Register blueprints ───────────────────────────────────────────────────
    # auth_bp first — /api/auth/login must be reachable without a token
    for bp in (auth_bp, gate_bp, vault_bp, user_bp, role_bp, log_bp, surveillance_bp):
        app.register_blueprint(bp)

    @app.route("/")
    def home():
        return "✅ Flask app is running!"

    return app


if __name__ == "__main__":
    create_app().run(debug=True)