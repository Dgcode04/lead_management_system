from sqlalchemy.orm import Session
from datetime import date
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