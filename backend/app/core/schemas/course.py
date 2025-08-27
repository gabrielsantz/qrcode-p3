import uuid
from typing import Optional
from pydantic import BaseModel

class TeacherInfo(BaseModel):
    id: uuid.UUID
    name: str

    class Config:
        from_attributes = True 

class CourseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    teacher_id: uuid.UUID

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CourseRead(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    teacher: TeacherInfo

    class Config:
        from_attributes = True 