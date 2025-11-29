# app/models/telecaller_profile.py
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, String, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class TelecallerProfile(Base):
    __tablename__ = "telecallers_table"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    status = Column(String(20), default="Active", nullable=False)  # Active / Inactive
    last_login = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="telecaller_profile", uselist=False)
