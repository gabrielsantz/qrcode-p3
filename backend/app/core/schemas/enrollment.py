import uuid
import datetime
from pydantic import BaseModel
from typing import Optional



class StudentInfo(BaseModel):
    id: uuid.UUID
    name: str
    registration: Optional[str] = None

    class Config:
        from_attributes = True

class CourseInfo(BaseModel):
    id: uuid.UUID
    name: str

    class Config:
        from_attributes = True 
        

class EnrollmentCreate(BaseModel):
    student_id: uuid.UUID
    course_id: uuid.UUID

class EnrollmentRead(BaseModel):
    id: uuid.UUID
    enrolled_at: datetime.datetime
    student: StudentInfo
    course_: CourseInfo

    class Config:
        from_attributes = True 