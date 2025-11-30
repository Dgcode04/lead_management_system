from sqlalchemy import Column, Integer, String, DateTime, func, Enum
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

from app.db.database import Base

class LeadSource(PyEnum):
    website = "website"
    linkedin = "linkedin"
    direct = "direct"
    reference = "reference"
    google_ads = "google_ads"
    trade_show = "trade_show"
    other = "other"


class LeadStatus(PyEnum):
    new = "new"
    contacted = "contacted"
    follow_up = "follow_up"
    interested = "interested"
    converted= "converted"
    not_interested = "not_interested"


class Leads(Base):
    __tablename__ = "all_leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)
    email = Column(String(120), nullable=False)
    company = Column(String(150), nullable=True)

    source = Column(String(100), nullable=False)
    status = Column(String(100), nullable=False)

    assignto = Column(String(100), nullable=True)   # telecaller name or id
    contact = Column(Integer, default=0)
    action = Column(String(300), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
