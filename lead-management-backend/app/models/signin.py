# models/user.py
from sqlalchemy import Column, Integer, String, Enum as SqlEnum, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.database import Base
from enum import Enum

class UserRole(Enum):
    admin = "admin"
    telecaller = "telecaller"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # IMPORTANT FIX ↓↓↓
    role = Column(SqlEnum(UserRole), default=UserRole.telecaller)

    created_at = Column(TIMESTAMP, server_default=func.now())
    
    telecaller_profile = relationship(
        "TelecallerProfile", uselist=False, back_populates="user"
    )