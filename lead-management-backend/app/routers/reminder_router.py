from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.reminder import ReminderCreate, ReminderResponse
from app.services.reminder_service import create_reminder_service, get_reminders_by_lead_id_service, get_upcoming_followups
from app.core.security import get_current_user


router = APIRouter(prefix="/reminders", tags=["Reminders"])


@router.post("/create", response_model=ReminderResponse)
def create_reminder(payload: ReminderCreate, db: Session = Depends(get_db)):
    return create_reminder_service(db, payload)

@router.get("/get/{lead_id}", response_model=list[ReminderResponse])
def get_reminders_by_lead_id(lead_id: int, db: Session = Depends(get_db)):
    return get_reminders_by_lead_id_service(db, lead_id)

@router.get("/upcoming-followups")
def upcoming_followups(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user["id"]
    return get_upcoming_followups(db, user_id)