from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    title = Column(String(255))
    description = Column(String(255))

    reminder_date = Column(Date)
    reminder_time = Column(Time)

    status = Column(Enum("pending", "completed", name="reminder_status"), default="pending")
    
    lead = relationship("Lead")
    user = relationship("User")
