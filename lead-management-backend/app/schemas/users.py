from pydantic import BaseModel
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    telecaller = "telecaller"

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    name: str
    password: str
    role: UserRole = UserRole.telecaller

class TelecallerCreate(BaseModel):
    name: str
    email: str
    phone: str
    
class UserResponse(UserBase):
    id: int
    name: str
    role: UserRole

    class Config:
        orm_mode = True
