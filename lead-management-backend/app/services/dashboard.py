from sqlalchemy.orm import Session
from datetime import date, timedelta
from sqlalchemy import func, extract, and_, case,or_
from app.models.leads import Lead
from app.models.lead_calls import LeadCall
from app.models.reminder import Reminder
from app.models.signin import User, UserRole
from app.models.telecaller_profile import TelecallerProfile



def get_dashboard_summary_service(db: Session, user_id: int):
    # 1) Total leads created by telecaller
    total_leads = db.query(Lead).filter(
        or_(
            Lead.created_by == user_id,
            Lead.assigned_to == user_id
        )
    ).count()

    # 2) New leads (e.g., last 24 hours)
    new_leads = (
        db.query(Lead)
        .filter(
        or_(
            Lead.created_by == user_id,
            Lead.assigned_to == user_id
        )
    )
        .filter(Lead.initial_status == "new")
        .count()
    )

    interested_leads = (
        db.query(Lead)
        .filter(
        or_(
            Lead.created_by == user_id,
            Lead.assigned_to == user_id
        )
    )
        .filter(Lead.initial_status == "interested")
        .count()
    )

    # 3) Total calls made
    total_calls = (
        db.query(LeadCall)
        .filter(
        or_(
            LeadCall.user_id == user_id,
            # LeadCall.assigned_to == user_id
        )
    )
        .count()
    )

    # 4) Pending follow-ups (reminders)
    pending_followups = (
        db.query(Reminder)
        .filter(
        or_(
            Reminder.user_id == user_id,
            # Reminder.assigned_to == user_id
        )
    )
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


def get_admin_dashboard_service(db: Session):

    # today = datetime.now()
    # week_start = today - timedelta(days=7)

    # Total leads
    total_leads = db.query(func.count(Lead.id)).scalar()

    # New leads this week
    new_this_week = (
        db.query(func.count(Lead.id))
        # .filter(Lead.created_by == user_id)
        .filter(Lead.initial_status == "new")
        .scalar()
    )

    # Telecaller count
    total_telecallers = (
        db.query(func.count(User.id))
        .filter(User.role == UserRole.telecaller)
        .scalar()
    )

    # Inactive telecallers
    inactive_telecallers = (
        db.query(func.count(TelecallerProfile.id))
        .filter(TelecallerProfile.status == "Inactive")
        .scalar()
    )

    # Total calls
    total_calls = db.query(func.count(LeadCall.id)).scalar()

    # Conversions count
    total_conversions = (
        db.query(func.count(LeadCall.id))
        .filter(LeadCall.call_status == "Converted")
        .scalar()
    )

    # Conversion rate
    conversion_rate = 0
    if total_calls > 0:
        conversion_rate = round((total_conversions / total_calls) * 100, 2)

    # Pending follow-up calls
    pending_followups = (
        db.query(func.count(LeadCall.id))
        .filter(LeadCall.call_status == "Follow-up")
        .scalar()
    )

    # Interested prospects
    interested_prospects = (
        db.query(func.count(LeadCall.id))
        .filter(LeadCall.call_status == "Interested")
        .scalar()
    )

    # Unassigned leads
    unassigned_leads = (
        db.query(func.count(Lead.id))
        .filter(Lead.assigned_to == None)
        .scalar()
    )

    return {
        "total_leads":total_leads,
        "new_this_week":new_this_week,

        "total_telecallers":total_telecallers,
        "inactive_telecallers":inactive_telecallers,

        "total_conversions":total_conversions,
        "conversion_rate":conversion_rate,

        "total_calls":total_calls,
        "pending_followups":pending_followups,
        "interested_prospects":interested_prospects,

        "unassigned_leads":unassigned_leads
    }


def get_active_telecallers(db: Session):
    """
    Return a list of active telecallers with:
    - Total leads (created or assigned)
    - Converted leads
    - Conversion rate
    """

    telecallers = (
        db.query(
            User.id,
            User.name,
            func.count(func.distinct(Lead.id)).label("total_leads"),
            func.count(
                func.distinct(
                    case(
                        (LeadCall.call_status == "Converted", LeadCall.id),
                        else_=None
                    )
                )
            ).label("converted")
        )
        .join(TelecallerProfile, TelecallerProfile.user_id == User.id)
        .outerjoin(Lead, or_(Lead.created_by == User.id, Lead.assigned_to == User.id))
        .outerjoin(LeadCall, LeadCall.user_id == User.id)
        .filter(
            User.role == UserRole.telecaller,
            TelecallerProfile.status == "active"   # Only active telecallers
        )
        .group_by(User.id)
        .all()
    )

    result = []

    for row in telecallers:
        total = row.total_leads or 0
        converted = row.converted or 0

        rate = 0
        if total > 0:
            rate = (converted / total) * 100

        result.append({
            "name": row.name,
            "total_leads": total,
            "converted": converted,
            "conversion_rate": round(rate, 2)
        })

    return result

from sqlalchemy import func

def get_lead_status_distribution_service(db: Session):

    # Fetch count of each status
    status_counts = (
        db.query(Lead.initial_status, func.count(Lead.id))
        .group_by(Lead.initial_status)
        .all()
    )

    # Convert to dictionary
    status_map = {
        "new": 0,
        "contacted": 0,
        "interested": 0,
        "follow-up": 0,
        "not_interested": 0,
        "converted": 0
    }

    for initial_status, count in status_counts:
        if initial_status in status_map:
            status_map[initial_status] = count

    total = sum(status_map.values()) or 1  # avoid divide by zero

    # Add percentage values
    result = {  
        "new": {
            "count": status_map["new"],
            "percentage": round((status_map["new"] / total) * 100, 2)
        },
        "contacted": {
            "count": status_map["contacted"],
            "percentage": round((status_map["contacted"] / total) * 100, 2)
        },
        "interested": {
            "count": status_map["interested"],
            "percentage": round((status_map["interested"] / total) * 100, 2)
        },
        "follow_up": {
            "count": status_map["follow-up"],
            "percentage": round((status_map["follow-up"] / total) * 100, 2)
        },
        "not_interested": {
            "count": status_map["not_interested"],
            "percentage": round((status_map["not_interested"] / total) * 100, 2)
        },
        "converted": {
            "count": status_map["converted"],
            "percentage": round((status_map["converted"] / total) * 100, 2)
        }
    }

    return result


 