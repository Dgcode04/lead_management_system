# app/services/lead_call_service.py

from sqlalchemy.orm import Session
from app.models.lead_calls import LeadCall

def create_lead_call_service(db: Session, payload, user_id: int):

    duration_seconds = payload.duration_seconds or 0
    duration_minutes = duration_seconds // 60

    new_call = LeadCall(
        lead_id=payload.lead_id,
        user_id=user_id,
        call_status=payload.call_status,
        call_type=payload.call_type,
        duration_seconds=duration_seconds,
        duration_minutes=duration_minutes,
        notes=payload.notes
    )

    db.add(new_call)
    db.commit()
    db.refresh(new_call)
    return new_call

def get_calls_by_lead_id_service(db: Session, lead_id: int):
    calls = db.query(LeadCall).filter(LeadCall.lead_id == lead_id).all()
    return calls

# def get_follow_up_leads_service(db: Session):
#     return (
#         db.query(LeadCall)
#         .filter(LeadCall.call_status == "follow_up")
#         .order_by(LeadCall.id.desc())
#         .all()
#     )