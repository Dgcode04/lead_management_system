from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional


class ReminderCreate(BaseModel):
    lead_id: int
    user_id: int
    title: str
    description: Optional[str] = None
    reminder_date: date
    reminder_time: time
    status: Optional[str] = "pending"

    model_config = {"from_attributes": True}

class ReminderUpdateRequest(BaseModel):
    completed: bool
    note: str | None = None
    date_time: datetime | None = None


class ReminderResponse(BaseModel):
    id: int
    lead_id: int
    user_id: int
    title: str
    description: Optional[str]
    reminder_date: date
    reminder_time: time
    status: Optional[str] = "pending"

    model_config = {"from_attributes": True}
