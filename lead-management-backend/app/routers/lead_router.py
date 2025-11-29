from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.lead import LeadCreate, LeadResponse, LeadBase
from app.services.lead_service import create_lead, get_all_lead_sources, get_all_lead_status, get_all_leads, get_lead_by_id, get_recent_leads_service
from app.core.security import get_current_user


router = APIRouter(prefix="/leads", tags=["Leads"])


@router.post("/add", response_model=LeadResponse)
def create_new_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    return create_lead(db, payload)

@router.get("/lead-sources")
def fetch_lead_sources():
    """API for getting all lead source values"""
    sources = get_all_lead_sources()
    return {"lead_sources": sources}

@router.get("/lead-status")
def fetch_lead_status():
    """API for getting all lead status values"""
    status = get_all_lead_status()
    return {"lead_status": status}

@router.get("/leads-list", response_model=list[LeadResponse])
def fetch_leads(db: Session = Depends(get_db)):
    """API for getting all leads"""
    allLeads = get_all_leads(db)
    return allLeads

@router.get("/lead/{lead_id}", response_model=LeadResponse)
def fetch_lead_by_id(lead_id: int, db: Session = Depends(get_db)):
    """API for getting lead by id"""
    return get_lead_by_id(db, lead_id)
    
@router.get("/recent", response_model=list[LeadResponse])
def recent_leads(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get last 5 leads created by logged-in telecaller.
    """
    user_id = current_user["id"]
    leads = get_recent_leads_service(db, user_id)
    return leads