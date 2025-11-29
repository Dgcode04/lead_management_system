from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.dashboard import get_dashboard_summary_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def dashboard_summary(request: Request, db: Session = Depends(get_db)):
    user_id = request.cookies.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    summary = get_dashboard_summary_service(db, int(user_id))
    return summary
