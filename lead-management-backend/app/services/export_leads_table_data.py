import io, csv
from app.models.leads import Lead
from app.db.session import get_db
from sqlalchemy.orm import Session


def export_leads_table_data(db: Session, user_id: int):
    leads = (
        db.query(Lead).filter(Lead.created_by == user_id).all()
    )

    header = ["ID", "Name", "Phone", "Email", "Company", "Status", "Source", "Created At"]

    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(header)

    for lead in leads:
        writer.writerow([
            lead.id,
            lead.name,
            lead.phone,
            lead.email,
            lead.company,
            lead.initial_status,
            lead.source,
            lead.created_at.strftime("%Y-%m-%d %H:%M:%S") if lead.created_at else ""
        ])
    
    output.seek(0)
    return output
    