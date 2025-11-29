from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.users import UserResponse, TelecallerCreate
from app.schemas.telecallers import TelecallerCreate, TelecallerResponse, GetAllTelecallerResponse
from app.services.telecallers_service import create_telecaller, get_all_telecallers

router = APIRouter(prefix="/telecallers", tags=["Telecaller Admin"])

@router.post("/add", response_model=TelecallerResponse)
def add_telecaller(payload: TelecallerCreate, db: Session = Depends(get_db)):
    return create_telecaller(db, payload)

@router.get("/all", response_model=list[TelecallerResponse])
def fetch_all_telecallers(db: Session = Depends(get_db)):
    return get_all_telecallers(db)

@router.get("/telecallers-lists", response_model=list[GetAllTelecallerResponse])
def list_telecallers(db: Session = Depends(get_db)):
    telecallers = get_all_telecallers(db)
    return telecallers

@router.post("/create_telecaller", response_model=UserResponse)
def create_user(payload: TelecallerCreate, db: Session = Depends(get_db)):
    user = create_telecaller(db, payload)
    return user