from pydantic import BaseModel, EmailStr
import uuid

from app.core.models import UserRole

class UserCreate(BaseModel):
    name:str
    registration: str
    email: EmailStr
    password: str
    role: UserRole

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