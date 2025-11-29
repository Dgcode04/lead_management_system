from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(120))
    phone = Column(String(20))
    source = Column(String(100))
    initial_status = Column(String(50))
    company = Column(String(100))
    campaign = Column(String(100))

    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    created_by_user = relationship("User", foreign_keys=[created_by])
    assigned_user = relationship("User", foreign_keys=[assigned_to])

    calls = relationship("LeadCall", back_populates="lead")
    reminders = relationship("Reminder", back_populates="lead")
