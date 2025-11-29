# app/routers/admin_telecaller_router.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
# from app.core.security import admin_only
from app.services.telecallers_service import get_telecaller_list_service
from app.schemas.telecallers import TelecallerListResponse, GetAllTelecallerResponse
from app.models.telecaller_profile import TelecallerProfile
from app.models.signin import User
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/telecallers", response_model=TelecallerListResponse)
def list_telecallers(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=200),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    # admin=Depends(admin_only)
):
    total, items = get_telecaller_list_service(db, page=page, size=size, q=q)
    return {"total": total, "page": page, "size": size, "items": items}


@router.put("/telecaller/{user_id}/toggle")
def toggle_telecaller_status(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(TelecallerProfile).filter(TelecallerProfile.user_id == user_id).first()
    if not profile:
        # if profile not found, optionally create one
        user = db.query(User).filter(User.id == user_id, User.role == "telecaller").first()
        if not user:
            raise HTTPException(status_code=404, detail="Telecaller not found")
        profile = TelecallerProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    profile.status = "Inactive" if profile.status == "Active" else "Active"
    db.add(profile)
    db.commit()
    db.refresh(profile)

    return {"user_id": user_id, "status": profile.status}
