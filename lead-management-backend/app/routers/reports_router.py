from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.reports import get_admin_reports_service, dashboard_export_service
from app.schemas.dashboard import DashboardResponse
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/data", response_model=DashboardResponse)
def get_dashboard(range_days: int, telecaller_id: int | None = None, db: Session = Depends(get_db)):
    return get_admin_reports_service(db, range_days, telecaller_id)

@router.get("/export-csv")
def export_dashboard_csv(range_days: int, telecaller_id: int | None = None, db: Session = Depends(get_db)):
    
    dashboard_data = get_admin_reports_service(db, range_days, telecaller_id)

    csv_file = dashboard_export_service(dashboard_data, range_days, telecaller_id)

    return StreamingResponse(
        csv_file,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=dashboard_report.csv"
        }
    )


