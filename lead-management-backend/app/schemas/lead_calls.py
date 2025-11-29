# app/schemas/lead_call.py

from pydantic import BaseModel
from typing import Optional

class LeadCallCreate(BaseModel):
    lead_id: int
    call_status: Optional[str] = None
    call_type: str
    duration_seconds: int
    notes: Optional[str] = None

class LeadCallResponse(BaseModel):
    id: int
    lead_id: int
    user_id: int
    call_status: Optional[str]
    call_type: str
    duration_seconds: Optional[int]
    duration_minutes: int
    notes: Optional[str]

    model_config = {"from_attributes": True}
