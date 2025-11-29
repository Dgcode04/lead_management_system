from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user
from app.services.export_leads_table_data import export_leads_table_data

router = APIRouter(prefix="/leads", tags=["Leads"])

@router.get("/export")
def export_leads_csv(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):

    csv_file = export_leads_table_data(db, current_user["id"])

    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads_export.csv"}
    )
