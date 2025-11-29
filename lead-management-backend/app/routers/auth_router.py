from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from app.models.signin import User,UserRole
from app.schemas.users import UserBase, UserResponse
from app.db.session import get_db
from fastapi.responses import JSONResponse
from app.models.telecaller_profile import TelecallerProfile
from datetime import datetime


router = APIRouter(prefix="/auth",tags=["Auth"])

@router.post("/signin")
def signin(user: UserBase, response= Response, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    # for now, just match password directly (no hash)
    # Set cookie
    response = JSONResponse({
        "message": "Login successful",
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email,
        "role": db_user.role.value,
    })

    response.set_cookie(key="user_id", value=db_user.id, httponly=True)

    return response

@router.post("/logout")
def logout():
    response = JSONResponse({"message": "Logged out successfully"})

    # remove cookie
    response.delete_cookie(
        key="user_id",
        httponly=True,
        samesite="lax"
    )
    
    return response
