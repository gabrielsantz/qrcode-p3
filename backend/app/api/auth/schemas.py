from pydantic import BaseModel, EmailStr, model_serializer
from typing import Any, Optional
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
    name: str
    role: UserRole
    student_id: Optional[uuid.UUID] = None
    teacher_id: Optional[uuid.UUID] = None
    is_active: bool
    
    
    @model_serializer
    def serialize_model(self) -> dict[str, Any]:
        data = {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'is_active': self.is_active
        }
        
        if self.role == UserRole.STUDENT:
            data['student_id'] = self.student_id
        elif self.role == UserRole.TEACHER:
            data['teacher_id'] = self.teacher_id
        
        return data
    

    class Config:
        from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str