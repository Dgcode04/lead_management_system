# app/routers/lead_call_router.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.lead_calls import LeadCallCreate, LeadCallResponse
from app.services.lead_calls_service import create_lead_call_service, get_calls_by_lead_id_service
from app.core.security import get_current_user

router = APIRouter(prefix="/lead-calls", tags=["Lead Calls"])

@router.post("/add", response_model=LeadCallResponse)
def create_lead_call(payload: LeadCallCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user["id"]
    return create_lead_call_service(db, payload, user_id)

@router.get("/get/{lead_id}", response_model=list[LeadCallResponse])
def get_calls_by_lead_id(lead_id: int, db: Session = Depends(get_db)):
    return get_calls_by_lead_id_service(db, lead_id)

# @router.get("/follow-ups", response_model=list[LeadCallResponse])
# def get_follow_up_calls(db: Session = Depends(get_db)):
#     return get_follow_up_leads_service(db)