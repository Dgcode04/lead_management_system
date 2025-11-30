from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from datetime import date, datetime
from app.models.leads import Lead
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate


def create_reminder_service(db: Session, payload: ReminderCreate):
    new_reminder = Reminder(
        lead_id=payload.lead_id,
        user_id=payload.user_id,
        title=payload.title,
        description=payload.description,
        reminder_date=payload.reminder_date,
        reminder_time=payload.reminder_time,
        status="pending"   # default status
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)
    return new_reminder


def get_reminders_by_lead_id_service(db: Session, lead_id: int):
    reminders = db.query(Reminder).filter(Reminder.lead_id == lead_id).all()
    return reminders

def get_upcoming_followups(db: Session, user_id: int):
    today = date.today()

    reminders = (
        db.query(Reminder)
        .join(Lead)
        .filter(Reminder.user_id == user_id)        # telecaller
        .filter(Reminder.reminder_date >= today)             # only upcoming
        .order_by(Reminder.reminder_date.asc(), Reminder.reminder_time.asc())
        .all()
    )

    results = []
    for reminder in reminders:
        results.append({
            "lead_name": reminder.lead.name,
            "company": reminder.lead.company,
            "date": reminder.reminder_date,
            "time": reminder.reminder_time,
            "title": reminder.title,
            "description": reminder.description
        })

    return results


def get_overdue_reminders_service(db: Session, telecaller_id: int):
    now = datetime.utcnow()

    # Fetch ALL reminders for the telecaller (pending + completed)
    reminders = (
        db.query(Reminder)
        .options(joinedload(Reminder.lead))
        .filter(Reminder.user_id == telecaller_id)
        .all()
    )

    pending_list = []
    completed_list = []

    for r in reminders:
        data = {
            "reminder_id": r.id,
            "title": r.title,
            "description": r.description,
            "reminder_date": r.reminder_date,
            "reminder_time": r.reminder_time,
            "lead_id": r.lead.id if r.lead else None,
            "lead_name": r.lead.name if r.lead else None,
            "lead_company": r.lead.company if r.lead else None,
            "lead_status": r.lead.initial_status if r.lead else None
        }

        if r.status == "pending":
            pending_list.append(data)
        else:
            completed_list.append(data)

    return {
        "pending": pending_list,
        "completed": completed_list
    }

def update_reminder_status_service(
    db: Session,
    reminder_id: int,
    completed: bool,
    note: str = None,
    date_time: datetime = None
):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()

    if not reminder:
        return None
    if completed:
        reminder.status = "completed"
    else:
        reminder.status = "pending"

    if note is not None:
        reminder.note = note

    if date_time is not None:
        reminder.date_time = date_time

    db.commit()
    db.refresh(reminder)

    return reminder
