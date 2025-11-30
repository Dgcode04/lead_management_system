from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.reminder import ReminderCreate, ReminderResponse, ReminderUpdateRequest
from app.services.reminder_service import create_reminder_service, get_reminders_by_lead_id_service, get_upcoming_followups, get_overdue_reminders_service, update_reminder_status_service
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

@router.get("/telecaller/{telecaller_id}/reminders/overdue")
def get_overdue_reminders(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_id = current_user["id"]
    return get_overdue_reminders_service(db, user_id)

@router.put("/reminder/{reminder_id}")
def update_reminder_status(
    reminder_id: int,
    payload: ReminderUpdateRequest,
    db: Session = Depends(get_db)
):

    updated = update_reminder_status_service(
        db,
        reminder_id,
        completed=payload.completed,
        note=payload.note,
        date_time=payload.date_time
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Reminder not found")

    return {"message": "Reminder updated successfully", "data": updated}
