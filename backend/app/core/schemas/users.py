from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

from app.core.models import UserRole

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole
    registration: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: uuid.UUID
    student_id: Optional[uuid.UUID] = None
    teacher_id: Optional[uuid.UUID] = None
    name: str
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str