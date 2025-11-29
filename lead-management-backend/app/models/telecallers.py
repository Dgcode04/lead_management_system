from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, Float
from app.db.database import Base

class Telecaller(Base):
    __tablename__ = "telecallers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False, unique=True)
    email = Column(String(120), nullable=False, unique=True)
    contact = Column(Integer, default=0)  # total contacts handled
    status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    active = Column(Boolean, default=True)
    converted = Column(Integer, default=0)
    lead = Column(Integer, default=0)
    calls = Column(Integer, default=0)
    login_origin = Column(String(100), nullable=True)  # e.g. 'web', 'mobile'
    conversion_rate = Column(Float, default=0.0)
