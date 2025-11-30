from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user
from app.services.dashboard import get_dashboard_summary_service, get_admin_dashboard_service, get_active_telecallers, get_lead_status_distribution_service
from app.schemas.dashboard import AdminDashboardResponse, TelecallerActiveResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user["id"]
    summary = get_dashboard_summary_service(db, user_id)
    return summary


@router.get("/admin/dashboard", response_model=AdminDashboardResponse)
def get_admin_dashboard(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_admin_dashboard_service(db)

@router.get("/active-telecallers", response_model=list[TelecallerActiveResponse])
def list_active_telecallers(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_active_telecallers(db)

@router.get("/dashboard/lead-status")
def lead_status_distribution(db: Session = Depends(get_db)):
    result = get_lead_status_distribution_service(db)
    return result
