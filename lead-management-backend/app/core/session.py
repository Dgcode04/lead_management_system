import secrets
from datetime import datetime, timedelta

# Simple in-memory session store
SESSIONS = {}

def create_session(user_id: int):
    token = secrets.token_hex(32)     # session ID
    SESSIONS[token] = {
        "user_id": user_id,
        "expires": datetime.utcnow() + timedelta(days=1)   # session expiry
    }
    return token

def get_user_from_session(session_token: str):
    session = SESSIONS.get(session_token)
    if not session:
        return None
    if session["expires"] < datetime.utcnow():
        return None
    return session["user_id"]
