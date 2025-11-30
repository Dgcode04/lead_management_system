import csv
import io
from fastapi.responses import StreamingResponse
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.leads import Lead
from app.models.lead_calls import LeadCall
from app.models.signin import User, UserRole


# def get_dashboard_service(db: Session, start_date: str, end_date: str):

#     start = datetime.strptime(start_date, "%Y-%m-%d")
#     end = datetime.strptime(end_date, "%Y-%m-%d")

#     # total leads created
#     total_leads = db.query(Lead).filter(
#         Lead.created_at.between(start, end)
#     ).count()

#     # total calls
#     total_calls = db.query(LeadCall).filter(
#         LeadCall.call_date.between(start, end)
#     ).count()

#     # converted leads
#     converted = db.query(Lead).filter(
#         Lead.initial_status == "converted",
#         Lead.created_at.between(start, end)
#     ).count()

#     # avg calls per lead
#     avg_calls = total_calls / total_leads if total_leads > 0 else 0

#     # conversion rate
#     conversion_rate = (converted / total_leads * 100) if total_leads > 0 else 0

#     # chart data (daily)
#     chart_data = (
#         db.query(
#             func.date(Lead.created_at).label("date"),
#             func.count(Lead.id).label("total_leads"),
#             func.count(LeadCall.id).label("total_calls"),
#         )
#         .outerjoin(LeadCall, LeadCall.lead_id == Lead.id)
#         .filter(Lead.created_at.between(start, end))
#         .group_by(func.date(Lead.created_at))
#         .order_by(func.date(Lead.created_at))
#         .all()
#     )

#     chart_result = [
#         {
#             "date": str(row.date),
#             "total_leads": row.total_leads,
#             "total_calls": row.total_calls,
#             "converted": converted  # optional (or calculate daily if needed)
#         }
#         for row in chart_data
#     ]

#     return {
#         "total_leads": total_leads,
#         "total_calls": total_calls,
#         "converted": converted,
#         "avg_calls_per_lead": round(avg_calls, 2),
#         "conversion_rate": round(conversion_rate, 2),
#         "chart": chart_result
#     }


def get_date_range_from_days(days: int):
    end = datetime.now()
    start = end - timedelta(days=days)
    return start, end

# def get_admin_reports_service(db: Session, range_days: int):

#     # Get start and end datetime
#     start, end = get_date_range_from_days(range_days)

#     # ------------------------
#     # TOTAL LEADS IN RANGE
#     # ------------------------
#     total_leads = db.query(Lead).filter(
#         Lead.created_at.between(start, end)
#     ).count()

#     # ------------------------
#     # TOTAL CALLS IN RANGE
#     # Replace call_date → created_at
#     # ------------------------
#     total_calls = db.query(LeadCall).filter(
#         LeadCall.call_date.between(start, end)
#     ).count()

#     # ------------------------
#     # CONVERTED LEADS
#     # ------------------------
#     converted = db.query(Lead).filter(
#         Lead.initial_status == "Converted",
#         Lead.created_at.between(start, end)
#     ).count()

#     # ------------------------
#     # AVG CALLS PER LEAD
#     # ------------------------
#     avg_calls = total_calls / total_leads if total_leads > 0 else 0

#     # ------------------------
#     # CONVERSION RATE
#     # ------------------------
#     conversion_rate = (converted / total_leads * 100) if total_leads > 0 else 0

#     # ------------------------
#     # STATUSWISE COUNT + PERCENTAGE
#     # ------------------------
#     status_rows = (
#         db.query(
#             Lead.initial_status,
#             func.count(Lead.id).label("total"),
#         )
#         .filter(Lead.created_at.between(start, end))
#         .group_by(Lead.initial_status)
#         .all()
#     )

#     status_summary = []
#     for row in status_rows:
#         percent = (row.total / total_leads * 100) if total_leads > 0 else 0
#         status_summary.append({
#             "status": row.initial_status,
#             "count": row.total,
#             "percentage": round(percent, 2)
#         })

#     # ---------------------------------------------
#     # 🟦 TELECALLER-WISE SUMMARY (NEW)
#     # ---------------------------------------------
#     telecallers = db.query(User).filter(User.role == UserRole.telecaller).all()
#     telecaller_summary = []

#     for t in telecallers:
#         # Leads assigned to this telecaller
#         tc_leads = db.query(Lead).filter(
#             or_(
#         Lead.assigned_to == t.id,
#         Lead.created_by == t.id
#     ),
#             Lead.created_at.between(start, end)
#         ).all()

#         tc_total_leads = len(tc_leads)

#         # Calls made by this telecaller
#         tc_total_calls = db.query(LeadCall).filter(
#             LeadCall.user_id == t.id,
#             LeadCall.call_date.between(start, end)
#         ).count()

#         # Converted for this telecaller
#         tc_converted = len([l for l in tc_leads if l.initial_status == "converted"])

#         telecaller_summary.append({
#             "telecaller_id": t.id,
#             "name": t.name,
#             "total_leads": tc_total_leads,
#             "total_calls": tc_total_calls,
#             "converted": tc_converted
#         })

#     # ------------------------
#     # SOURCE DATA (TOTAL lEAD + SOURCE NAME + PERCANTAGE)
#     # ------------------------

#         # --- Lead Source Summary (Website, Google, Referral, etc.) ---
#     source_data = (
#         db.query(
#             Lead.source,
#             func.count(Lead.id).label("count")
#         )
#         .filter(Lead.created_at.between(start, end))
#         .group_by(Lead.source)
#         .all()
#     )

#     lead_source_summary = []
#     for row in source_data:
#         percentage = (row.count / total_leads * 100) if total_leads > 0 else 0
        
#         lead_source_summary.append({
#             "source": row.source,
#             "total_leads": row.count,
#             "percentage": round(percentage, 2)
#         })


#     # ------------------------
#     # DAILY CHART (LEADS + CALLS)
#     # ------------------------
#     chart_data = (
#         db.query(
#             func.date(Lead.created_at).label("date"),
#             func.count(Lead.id).label("total_leads"),
#             func.count(LeadCall.id).label("total_calls"),
#         )
#         .outerjoin(LeadCall, LeadCall.lead_id == Lead.id)
#         .filter(Lead.created_at.between(start, end))
#         .group_by(func.date(Lead.created_at))
#         .order_by(func.date(Lead.created_at))
#         .all()
#     )

#     chart_result = [
#         {
#             "date": str(row.date),
#             "total_leads": row.total_leads,
#             "total_calls": row.total_calls,
#         }
#         for row in chart_data
#     ]

#     # ------------------------
#     # FINAL RESPONSE
#     # ------------------------
#     return {
#         "total_leads": total_leads,
#         "total_calls": total_calls,
#         "converted": converted,
#         "avg_calls_per_lead": round(avg_calls, 2),
#         "conversion_rate": round(conversion_rate, 2),
#         "status_summary": status_summary,
#         "chart": chart_result,
#         "telecaller_summary": telecaller_summary,
#         "source_summary": lead_source_summary
#     }


def get_admin_reports_service(db: Session, range_days: int, telecaller_id: int | None = None):

    start, end = get_date_range_from_days(range_days)

    # ------------------------------------
    # BASE FILTER (for single telecaller)
    # ------------------------------------
    lead_filter = [
        Lead.created_at.between(start, end)
    ]

    call_filter = [
        LeadCall.call_date.between(start, end)
    ]

    if telecaller_id:
        # Leads created or assigned to this telecaller
        lead_filter.append(
            or_(Lead.assigned_to == telecaller_id, Lead.created_by == telecaller_id)
        )
        # Calls made by this telecaller
        call_filter.append(
            LeadCall.user_id == telecaller_id
        )

    # ------------------------------------
    # TOTAL LEADS 
    # ------------------------------------
    total_leads = db.query(Lead).filter(*lead_filter).count()

    # ------------------------------------
    # TOTAL CALLS
    # ------------------------------------
    total_calls = db.query(LeadCall).filter(*call_filter).count()

    # ------------------------------------
    # CONVERTED
    # ------------------------------------
    converted = db.query(Lead).filter(
        Lead.initial_status == "Converted",
        *lead_filter
    ).count()

    # ------------------------------------
    # AVERAGE CALLS
    # ------------------------------------
    avg_calls = total_calls / total_leads if total_leads > 0 else 0

    # ------------------------------------
    # CONVERSION RATE %
    # ------------------------------------
    conversion_rate = (converted / total_leads * 100) if total_leads > 0 else 0

    # ------------------------------------
    # STATUSWISE SUMMARY
    # ------------------------------------
    status_rows = (
        db.query(
            Lead.initial_status,
            func.count(Lead.id).label("total"),
        )
        .filter(*lead_filter)
        .group_by(Lead.initial_status)
        .all()
    )

    status_summary = []
    for row in status_rows:
        percent = (row.total / total_leads * 100) if total_leads > 0 else 0
        status_summary.append({
            "status": row.initial_status,
            "count": row.total,
            "percentage": round(percent, 2)
        })

    # ------------------------------------
    # TELECALLER SUMMARY 
    # If telecaller_id selected → show only one
    # ------------------------------------
    telecaller_summary = []

    telecaller_query = db.query(User).filter(User.role == UserRole.telecaller)

    if telecaller_id:
        telecaller_query = telecaller_query.filter(User.id == telecaller_id)

    telecallers = telecaller_query.all()

    for t in telecallers:

        tc_leads = db.query(Lead).filter(
            or_(Lead.assigned_to == t.id, Lead.created_by == t.id),
            Lead.created_at.between(start, end)
        ).all()

        tc_calls = db.query(LeadCall).filter(
            LeadCall.user_id == t.id,
            LeadCall.call_date.between(start, end)
        ).count()

        tc_converted = len([l for l in tc_leads if l.initial_status == "Converted"])

        telecaller_summary.append({
            "telecaller_id": t.id,
            "name": t.name,
            "total_leads": len(tc_leads),
            "total_calls": tc_calls,
            "converted": tc_converted
        })

    # ------------------------------------
    # SOURCE SUMMARY (Website, Referral, etc.)
    # ------------------------------------
    source_rows = (
        db.query(Lead.source, func.count(Lead.id).label("count"))
        .filter(*lead_filter)
        .group_by(Lead.source)
        .all()
    )

    source_summary = []
    for row in source_rows:
        percentage = (row.count / total_leads * 100) if total_leads > 0 else 0
        source_summary.append({
            "source": row.source,
            "total_leads": row.count,
            "percentage": round(percentage, 2)
        })

    # ------------------------------------
    # DAILY CHART (leads + calls)
    # ------------------------------------
    chart_rows = (
        db.query(
            func.date(Lead.created_at).label("date"),
            func.count(Lead.id).label("total_leads"),
            func.count(LeadCall.id).label("total_calls"),
        )
        .outerjoin(LeadCall, LeadCall.lead_id == Lead.id)
        .filter(*lead_filter)
        .group_by(func.date(Lead.created_at))
        .order_by(func.date(Lead.created_at))
        .all()
    )

    chart_data = [
        {
            "date": str(r.date),
            "total_leads": r.total_leads,
            "total_calls": r.total_calls
        }
        for r in chart_rows
    ]

    # ------------------------------------
    # FINAL RESPONSE
    # ------------------------------------
    return {
        "total_leads": total_leads,
        "total_calls": total_calls,
        "converted": converted,
        "avg_calls_per_lead": round(avg_calls, 2),
        "conversion_rate": round(conversion_rate, 2),
        "status_summary": status_summary,
        "telecaller_summary": telecaller_summary,
        "source_summary": source_summary,
        "chart": chart_data
    }


def dashboard_export_service(dashboard_data: dict, range_days: int):

    start_date = datetime.now() - timedelta(days=range_days)
    end_date = datetime.now()

    output = io.StringIO()
    writer = csv.writer(output)

    # ===== HEADER =====
    writer.writerow(["Lead Management System - Report"])
    writer.writerow(["Generated:", datetime.now().strftime("%B %d, %Y %H:%M")])

    # Date range text
    writer.writerow(["Date Range:", f"{start_date} to {end_date}"])
    writer.writerow(["User Filter:", "All Users"])

    writer.writerow([])

    # ===== SUMMARY STATISTICS =====
    writer.writerow(["Summary Statistics"])
    writer.writerow(["Metric", "Value"])

    writer.writerow(["Total Leads", dashboard_data["total_leads"]])
    writer.writerow(["Converted Leads", dashboard_data["converted"]])
    writer.writerow(["Total Calls", dashboard_data["total_calls"]])
    writer.writerow(["Avg. Calls per Lead", dashboard_data["avg_calls_per_lead"]])
    writer.writerow(["Conversion Rate", f"{dashboard_data['conversion_rate']}%"])

    writer.writerow([])

    # ===== STATUS DISTRIBUTION =====
    writer.writerow(["Lead Status Distribution"])
    writer.writerow(["Status", "Count"])

    status_data = dashboard_data.get("status_distribution", {})
    for status, count in status_data.items():
        writer.writerow([status, count])

    writer.writerow([])

    # ===== TELECALLER PERFORMANCE =====
    writer.writerow(["Telecaller Performance"])
    writer.writerow(["Name", "Leads", "Calls", "Converted"])

    for t in dashboard_data.get("telecaller_summary", []):
        writer.writerow([
            t["name"],
            t["total_leads"],
            t["total_calls"],
            t["converted"]
        ])

    output.seek(0)
    return output


