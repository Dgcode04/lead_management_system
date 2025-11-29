from pydantic import BaseModel, EmailStr
from datetime import datetime

class TelecallerCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr

class TelecallerResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: EmailStr

class AssignedToUser(BaseModel):
    id: int
    name: str

class GetAllTelecallerResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    contact: str| int | None = None
    status: str | None = None
    created: datetime
    # active: bool
    converted: int | None = None
    lead: int | None = None
    calls: int | None = None
    last_login: datetime | None = None  
    conversion_rate: float | None = None
    assigned_to: AssignedToUser | None = None

class TelecallerListResponse(BaseModel):
    total: int
    page: int
    size: int
    items: list[GetAllTelecallerResponse]

    class Config:
        orm_mode = True
        from_attributes = True   # Pydantic v2
