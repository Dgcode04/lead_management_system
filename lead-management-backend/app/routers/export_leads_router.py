from fastapi import APIRouter, Depends, File, UploadFile, Form
from fastapi.responses import StreamingResponse
import csv, io
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user
from app.services.export_leads_table_data import export_leads_table_data
from app.models.signin import User
from app.models.leads import Lead


router = APIRouter(prefix="/leads", tags=["Leads"])

@router.get("/export")
def export_leads_csv(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    csv_file = export_leads_table_data(
        db=db,
        user_id=current_user["id"],
        role=current_user["role"]     # <-- Pass role
    )

    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads_export.csv"}
    )


@router.post("/import")
async def import_leads_csv(
    file: UploadFile = File(...),

    default_status: str = Form(...),
    default_assigned_to: int = Form(...),

    override_status: bool = Form(...),
    override_assigned_to: bool = Form(...),

    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    content = await file.read()
    text = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))

    inserted, skipped = [], []

    for row in reader:
        # Normalize headers
        row = {k.strip().lower(): (v.strip() if v else None) for k, v in row.items()}

        # Required fields
        if not row.get("name") or not row.get("email") or not row.get("phone"):
            skipped.append(row)
            continue

        # --------------------------
        # STATUS
        # --------------------------
        if override_status:
            status = default_status
        else:
            status = row.get("status") or default_status

        # --------------------------
        # ASSIGNED TO (name → user_id)
        # --------------------------
        assigned_to = None

        if override_assigned_to:
            assigned_to = default_assigned_to
        else:
            # CSV field is "assigned to" (with space)
            assigned_name = row.get("assigned to")

            if assigned_name:
                user_obj = db.query(User).filter(User.name == assigned_name).first()
                if user_obj:
                    assigned_to = user_obj.id
                else:
                    # Invalid user → skip row
                    skipped.append(row)
                    continue
            else:
                assigned_to = default_assigned_to

        # --------------------------
        # CREATE LEAD
        # --------------------------
        lead = Lead(
            name=row.get("name"),
            email=row.get("email"),
            phone=row.get("phone"),
            company=row.get("company"),
            source=row.get("source"),
            initial_status=status,
            assigned_to=assigned_to,
            created_by=current_user["id"]
        )

        db.add(lead)
        inserted.append(lead)

    db.commit()

    return {
        "message": "Import Complete",
        "inserted_count": len(inserted),
        "skipped_count": len(skipped),
        "skipped_rows": skipped
    }
