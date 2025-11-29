from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class LeadCall(Base):
    __tablename__ = "lead_calls"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    # connected, not_connected, interested, etc.
    call_status = Column(Enum(
        "connected", "not_connected", "interested",
        "not_interested", "follow_up", name="call_status_enum"
    ))

    # NEW → incoming / outgoing
    call_type = Column(Enum("incoming", "outgoing", name="call_type_enum"))

    # NEW → store raw seconds from user
    duration_seconds = Column(Integer, default=0)

    # NEW → store auto-converted minutes
    duration_minutes = Column(Integer, default=0)

    notes = Column(String(255))

    lead = relationship("Lead", back_populates="calls")
