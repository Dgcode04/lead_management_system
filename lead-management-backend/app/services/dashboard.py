from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.models.leads import Lead
from app.models.lead_calls import LeadCall
from app.models.reminder import Reminder

def get_dashboard_summary_service(db: Session, user_id: int):
    # 1) Total leads created by telecaller
    total_leads = db.query(Lead).filter(Lead.created_by == user_id).count()

    # 2) New leads (e.g., last 24 hours)
    new_leads = (
        db.query(Lead)
        .filter(Lead.created_by == user_id)
        .filter(Lead.initial_status == "new")
        .count()
    )

    interested_leads = (
        db.query(Lead)
        .filter(Lead.created_by == user_id)
        .filter(Lead.initial_status == "interested")
        .count()
    )

    # 3) Total calls made
    total_calls = (
        db.query(LeadCall)
        .filter(LeadCall.user_id == user_id)
        .count()
    )

    # 4) Pending follow-ups (reminders)
    pending_followups = (
        db.query(Reminder)
        .filter(Reminder.user_id == user_id)
        .filter(Reminder.status == "pending")
        .count()
    )

    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "interested_leads":interested_leads,
        "total_calls": total_calls,
        "conversions": 0,   # add logic if needed
        "pending_followups": pending_followups
    }
