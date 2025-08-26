from pydantic import BaseModel, EmailStr
from typing import Optional

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
    name: str
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str