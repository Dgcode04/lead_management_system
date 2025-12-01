import io, csv
from app.models.leads import Lead
from app.models.signin import User
from sqlalchemy.orm import Session
from sqlalchemy import or_


def export_leads_table_data(db: Session, user_id: int, role: str):
    
    # 👇 Admin sees all leads
    if role == "admin":
        leads = db.query(Lead).all()
        header = ["ID", "Name", "Phone", "Email", "Company", "Status", "Source", "Assigned To", "Created At"]
    else:
        # 👇 Telecaller sees only their leads
        leads = db.query(Lead).filter(or_(
                Lead.created_by == user_id,
                Lead.assigned_to == user_id
            )).all()
        header = ["ID", "Name", "Phone", "Email", "Company", "Status", "Source", "Created At"]

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(header)

    for lead in leads:
        row = [
            lead.id,
            lead.name,
            lead.phone,
            lead.email,
            lead.company,
            lead.initial_status,
            lead.source,
        ]

        # Add assigned column only for admin
        if role == "admin":
            assigned_user = db.query(User).filter(User.id == lead.assigned_to).first()
            assigned_name = assigned_user.name if assigned_user else "Not Assigned"
            row.append(assigned_name)

        row.append(
            lead.created_at.strftime("%Y-%m-%d %H:%M:%S") if lead.created_at else ""
        )

        writer.writerow(row)

    output.seek(0)
    return output
