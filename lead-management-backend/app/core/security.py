from fastapi import Cookie, HTTPException, Depends

def get_current_user(user_id: int = Cookie(None)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return {"id": user_id, "role": "admin" if user_id == 1 else "telecaller"}

def admin_only(current_user = Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    return current_user