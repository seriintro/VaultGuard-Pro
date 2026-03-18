#  🚀  VaultGuard Pro — AI-Powered Access Control & Surveillance System

VaultGuard Pro is a full-stack security system that simulates real-world access control using face recognition, multi-factor authentication, and role-based permissions. The system includes gate authentication, live surveillance monitoring, security logging, and an administrative dashboard for system oversight.
## 📸 Preview

[Dashboard]
<p align="center">
<img width="900" height="871" alt="Screenshot 2025-05-18 175555" src="https://github.com/user-attachments/assets/397a9bb7-c7ec-41c7-8a6e-a3c61407841a" />
</p>

---

## ✨ Features

- **Gate 1** — Face-only recognition for entry
- **Gate 2** — Face + password (MFA) for restricted areas
- **Vault** — Two-person authentication required to unlock
- **Live Surveillance** — Real-time face detection with automatic video recording of unknown individuals
- **Surveillance Logs** — Logs for both known and unknown faces detected during live surveillance
- **Access Logs** — Records every gate/vault access attempt
- **User Management** — Admin can register new users or remove existing users
- **RBAC** — Create roles, assign permissions per gate, assign roles to users
- **Unknown Person Alert Notifications** — Displays real-time notifications whenever an unknown face is detected during surveillance
- **Admin Dashboard** — Centralized React dashboard providing system analytics and administration tools to monitor system activity
- **JWT Authentication** — Secure admin login backed by the user database


---

## Use Cases

VaultGuard Pro can be applied in several real-world scenarios:

- Smart office access control systems
- Secure research labs and restricted zones
- University campus entry monitoring
- Surveillance systems for sensitive facilities
- Prototype for AI-powered smart building security

---

##  🛠️ Tech Stack

- Frontend: React (Vite), React Router, Recharts  
- Backend: Flask (Python)  
- Computer Vision: OpenCV, face_recognition (dlib)  
- Security: bcrypt, JWT, Fernet encryption  
- Storage: JSON-based database
- Deployment & Tunneling: Netlify, ngrok  
---

##  🏗️ System Architecture

VaultGuard Pro is built as a modular full-stack security system consisting of a frontend dashboard, backend API services, and a computer vision processing layer. The architecture is designed to simulate a smart access control system with surveillance monitoring and role-based authorization.

### Core Components

| Component | Description |
|---|---|
| Frontend (React + Vite) | Provides the admin dashboard for monitoring surveillance, managing users and roles, and visualizing system analytics such as access attempts and activity heatmaps. |
| Backend API (Flask) | Handles authentication, access control logic, RBAC permission checks, logging, and communication between the frontend and the computer vision modules. |
| Computer Vision Engine | Uses OpenCV and face_recognition (dlib) to detect and recognize faces from the camera feed. |
| Access Control Layer | Validates identity, checks user roles and permissions, and determines whether access to Gate 1, Gate 2, or Vault should be granted or denied. |
| Logging System | Records access attempts and surveillance detections for auditing and security monitoring. |
| Data Storage | Stores user information, roles, permissions, and system logs using lightweight JSON-based storage. |

### System Flow

1. Capture image from camera  
2. Detect and recognize face  
3. Identify user (if match found)  
4. Check access permissions (RBAC)  
5. Grant or deny access  
6. Log the event and update dashboard  

### High-Level Architecture Flow

```
Camera / Phone Capture
        │
        ▼
Face Detection (OpenCV)
        │
        ▼
Face Recognition (face_recognition / dlib)
        │
        ▼
Backend API (Flask)
        │
        ├── Identity Verification
        ├── RBAC Permission Check
        ├── Gate Access Decision
        │
        ▼
Logging System
        │
        ├── Access Logs
        └── Surveillance Logs
        │
        ▼
React Admin Dashboard
        │
        ├── User & Role Management
        ├── Security Analytics
        ├── Access Monitoring
        └── Surveillance Monitoring
```

---

## 🔐  Security Layers

The system implements multiple security layers:

- **Face Recognition Authentication** — Identity verified against stored face encodings
- **Password Verification (Gate 2)** — Additional password check on top of face recognition
- **Two-Person Authentication (Vault)** — Requires two separate authorized users within a time window
- **Role-Based Access Control (RBAC)** — Each role has explicit per-gate permissions
- **Encrypted Sensitive Data** — Image paths and sensitive fields encrypted using Fernet symmetric encryption
- **JWT-Based Admin Authentication** — Signed tokens with expiry for secure dashboard access

---

##  📁 Project Structure

```
access-control-system/
│
├── app.py                          # Flask app factory — entry point
├── security_utils.py               # Password hashing, encryption, decryption
│
├── config/
│   └── settings.py                 # Global constants and file paths
│
├── models/
│   └── database.py                 # JSON read/write with in-memory caching
│
├── services/
│   ├── access_service.py           # Gate 1, Gate 2, Vault authentication logic
│   ├── auth_service.py             # JWT login and token verification
│   ├── logging_service.py          # CSV access log
│   ├── rbac_service.py             # Role management
│   └── registration_service.py    # User and visitor registration
│
├── routes/
│   ├── auth_routes.py              # POST /api/auth/login, GET /api/auth/me
│   ├── gate_routes.py              # POST /api/gate1-access, /api/gate2-access
│   ├── vault_routes.py             # POST /api/vault-access
│   ├── user_routes.py              # CRUD /api/users
│   ├── role_routes.py              # CRUD /api/roles, POST /api/assign-role
│   └── log_routes.py               # GET /api/access-logs, /api/surveillance-logs
│
├── surveillance/
│   ├── config/settings.py          # Surveillance-specific constants
│   ├── services/
│   │   ├── face_processor.py       # Frame → face detections (stateless)
│   │   ├── frame_buffer.py         # Rolling camera frame buffer
│   │   ├── log_writer.py           # JSON surveillance log writer
│   │   ├── recorder.py             # Unknown-face video recording
│   │   └── user_loader.py          # Loads/reloads known faces from DB
│   └── routes/
│       └── surveillance_routes.py  # GET /live_feed, /unknown_videos
│
├── utils/
│   └── image_utils.py              # base64 → temp file context manager
│
├── user_db_test.json               # User database (name, role, password hash, encoding)
├── roles_test.json                 # Role permissions database
├── access_log_test.csv             # Gate access log
├── recognized_log_test.json        # Surveillance recognized faces log
├── unknown_log_test.json           # Surveillance unknown faces log
├── secure.key                      # Fernet encryption key (auto-generated)
└── known_faces_test/               # Stored face images
```

---

## ⚡ Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- A webcam (for surveillance and gate access)
- CMake + Visual Studio Build Tools (required for `dlib` on Windows)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/access-control-system.git
cd access-control-system
```

### 2. Install Python dependencies

```bash
pip install flask flask-cors face_recognition opencv-python bcrypt cryptography PyJWT numpy
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the backend

```powershell
# From the project root
python app.py
```

Flask will start at `http://127.0.0.1:5000`

### 5. Start the frontend

```powershell
# In a separate terminal, from the frontend folder
npm run dev
```

React will start at `http://localhost:5173`

---

## Default Login

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

> Only users with the `admin` role can log in to the dashboard. Change the password after first login by re-registering or updating the database.

---

##  📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with username + password |
| GET | `/api/auth/me` | Validate token, return current user |

### Gate Access
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/gate1-access` | Face-only recognition |
| POST | `/api/gate2-access` | Face + password (MFA) |
| POST | `/api/vault-access` | Two-person vault authentication |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Register new user |
| PUT | `/api/users/<name>` | Edit user role/password |
| DELETE | `/api/users/<name>` | Delete user |

### Roles
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/roles` | List all roles and permissions |
| POST | `/api/roles` | Create new role |
| DELETE | `/api/roles/<name>` | Delete role |
| POST | `/api/assign-role` | Assign role to user |

### Logs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/access-logs` | Gate access log (CSV) |
| GET | `/api/surveillance-logs` | Recognized + unknown face logs |

### Surveillance
| Method | Endpoint | Description |
|---|---|---|
| GET | `/live_feed` | MJPEG live camera stream |
| GET | `/unknown_videos` | List recorded unknown-face videos |
| GET | `/unknown_videos/<filename>` | Serve a recorded video |

---

## 📱  Gate Simulation

Gates are simulated using a phone browser and a public tunnel (ngrok).

### Flow
Phone → captures image → sends to backend → Flask processes request

### Steps
1. Run backend: `python app.py`  
2. Start ngrok: `ngrok http 5000`  
3. Update ngrok URL in gate HTML files  
4. Open deployed `cam_client/` on phone  

### Important Notes
- ngrok URL changes each session  
- Keep backend running during testing  
---

## How Gate Access Works

**Gate 1 (Face Only)**
1. Capture image from camera
2. Send as base64 to `POST /api/gate1-access`
3. Backend matches face against registered encodings
4. Checks if the matched user's role has `gate1: true`
5. Returns granted/denied + logs the event

**Gate 2 (Face + Password)**
- Same as Gate 1 but also requires a correct password
- Role must have `gate2: true`

**Vault (Two-Person)**
1. First person authenticates (face + password) → status: `waiting`
2. Second person authenticates within 60 seconds → status: `success`
3. Both must have `vault: true` on their role
4. Same person cannot authenticate twice

---

## 👁️  Surveillance

- Live feed streams from webcam at `GET /live_feed`
- Face recognition runs every 3rd frame (configurable via `PROCESS_EVERY_N_FRAMES`)
- Recognised faces are logged to `recognized_log_test.json`
- Unknown faces trigger automatic video recording saved to `unknown_videos/`
- Known faces list reloads from the database every 5 minutes automatically

---

## Configuration

### `surveillance/config/settings.py`
```python
PROCESS_EVERY_N_FRAMES = 3       # Higher = faster but less frequent detection
DETECTION_MODEL = "cnn"          # "cnn" (accurate) or "hog" (faster)
FACE_RECOGNITION_TOLERANCE = 0.55 # Lower = stricter matching
COOLDOWN_SECONDS = 10            # Minimum seconds between repeat log entries
USER_RELOAD_INTERVAL = 300       # How often to reload faces from DB (seconds)
```

---
