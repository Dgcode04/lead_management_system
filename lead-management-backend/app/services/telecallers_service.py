from sqlalchemy.orm import Session
from sqlalchemy import func, select, case
from fastapi import HTTPException
from app.models.signin import User, UserRole
from app.models.telecallers import Telecaller
from app.models.telecaller_profile import TelecallerProfile
from app.schemas.telecallers import TelecallerCreate, TelecallerResponse 
from app.models.leads import Lead
from app.models.lead_calls import LeadCall
from typing import Tuple, List, Dict
from datetime import datetime

def create_telecaller(db: Session, payload: TelecallerCreate):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 1️⃣ Create user
    new_tc = User(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        role=UserRole.telecaller,
        password=None
    )
    db.add(new_tc)
    db.commit()
    db.refresh(new_tc)

    # 2️⃣ Create telecaller profile automatically
    profile = TelecallerProfile(
        user_id=new_tc.id,
        status="Active",
        created_at=datetime.utcnow(),
        last_login=datetime.utcnow()
    )
    db.add(profile)
    db.commit()

    return TelecallerResponse(
        id=new_tc.id,
        name=new_tc.name,
        phone=new_tc.phone,
        email=new_tc.email
    )

# def get_all_telecallers(db: Session):
#     return db.query(Telecaller).order_by(Telecaller.id.desc()).all()

def get_all_telecallers(db: Session):
    """Fetch all telecallers"""
    return db.query(User).filter(User.role == UserRole.telecaller).all()

def get_telecaller_list_service(db: Session, page: int, size: int, q: str = None):

    query = (
        db.query(
            User.id.label("id"),
            User.name.label("name"),
            User.email.label("email"),
            User.phone.label("phone"),
            TelecallerProfile.status.label("status"),
            TelecallerProfile.created_at.label("created_at"),
            TelecallerProfile.last_login.label("last_login"),

            # Count leads created by telecaller
            func.count(func.distinct(Lead.id)).label("lead_count"),

            func.count(func.distinct(LeadCall.id)).label("call_count"),

            func.count(
                func.distinct(
                    case(
                        (LeadCall.call_status == "Converted", LeadCall.id),
                        else_=None
                    )
                )
            ).label("converted_count"),
        )
        .join(TelecallerProfile, TelecallerProfile.user_id == User.id)

        # JOIN Leads using created_by
        .outerjoin(Lead, Lead.assigned_to == User.id)        # FIXED
        .outerjoin(LeadCall, LeadCall.user_id == User.id)    # telecaller calls

        .filter(User.role == UserRole.telecaller)

        .group_by(User.id, TelecallerProfile.id)
    )

    # Search filter
    if q:
        query = query.filter(
            User.name.ilike(f"%{q}%") |
            User.email.ilike(f"%{q}%") |
            User.phone.ilike(f"%{q}%")
        )

    total = query.count()
    rows = query.offset((page - 1) * size).limit(size).all()

    result = []
    for row in rows:
        conv_rate = 0
        if row.lead_count and row.lead_count > 0:
            conv_rate = (row.converted_count / row.lead_count) * 100

        result.append({
            "id": row.id,
            "name": row.name,
            "email": row.email,
            "phone": row.phone,
            "status": row.status,
            "leads": row.lead_count,
            "calls": row.call_count,
            "converted": row.converted_count,
            "conversion_rate": round(conv_rate, 2),
            "created": row.created_at,
            "last_login": row.last_login
        })

    return total, result