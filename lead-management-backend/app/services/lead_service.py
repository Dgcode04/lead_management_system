from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import or_
from app.models.all_leads import LeadSource, LeadStatus
from app.models.leads import Lead
# from app.models.telecallers import Telecaller
from app.schemas.lead import LeadCreate, LeadBase, LeadResponse, LeadUpdate


def create_lead(db: Session, payload) -> Lead:
    """
    payload is a LeadCreate Pydantic model (or dict).
    created_by should be an integer user id if provided.
    """
    new_lead = Lead(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        source=payload.source,
        initial_status=payload.initial_status,
        company=payload.company,
        campaign=payload.campaign,
        assigned_to=payload.assigned_to,
        created_by=payload.created_by
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead

def get_all_lead_sources():
    """Return all lead source enum values"""
    return [source.value for source in LeadSource]

def get_all_lead_status():
    """Return all lead status enum values"""
    return [status.value for status in LeadStatus]

def get_all_leads(db: Session):
    """Return all leads"""
    return db.query(Lead).all()

def get_lead_by_id(db: Session, lead_id: int):
    """Return lead by id"""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

def get_recent_leads_service(db: Session, user_id: int, limit: int = 5):
    return (
        db.query(Lead)
        .filter(
            or_(
                Lead.created_by == user_id,
                Lead.assigned_to == user_id
            )
        )
        .order_by(Lead.created_at.desc())
        .limit(limit)
        .all()
    )

def update_lead(db: Session, lead_id: int, payload: LeadUpdate):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Update fields only if values are provided
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(lead, key, value)

    db.commit()
    db.refresh(lead)
    return lead