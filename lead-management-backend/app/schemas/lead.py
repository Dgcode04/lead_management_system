# app/schemas/lead.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Pydantic v2 style config so .from_attributes works when returning ORM objects
class LeadBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    initial_status: Optional[str] = None
    company: Optional[str] = None
    campaign: Optional[str] = None
    created_by: Optional[int] = None
    assigned_to: Optional[int] = None

    model_config = {"from_attributes": True}

class LeadCreate(LeadBase):
    name: str  # require at least name on create

class CreatedByUser(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    initial_status: Optional[str] = None
    company: Optional[str] = None
    campaign: Optional[str] = None

    model_config = {"from_attributes": True}

class LeadResponse(BaseModel):
    id: int
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    initial_status: Optional[str] = None
    company: Optional[str] = None
    campaign: Optional[str] = None
    created_at: Optional[datetime] = None
    created_by_user: Optional[CreatedByUser] = None  
    assigned_user: Optional[CreatedByUser] = None

    model_config = {"from_attributes": True}
