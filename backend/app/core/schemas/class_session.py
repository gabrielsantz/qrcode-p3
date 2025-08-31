import uuid
from datetime import datetime, date, time
from typing import Optional
from pydantic import BaseModel


class ClassSessionCreate(BaseModel):
    course_id: uuid.UUID
    course_schedule_id: Optional[uuid.UUID] = None
    date: date
    start_time: time
    end_time: time
    title: Optional[str] = None
    description: Optional[str] = None


class ClassSessionRead(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    course_schedule_id: Optional[uuid.UUID]
    date: date
    start_time: time
    end_time: time
    title: Optional[str]
    description: Optional[str]

    class Config:
        from_attributes = True


class GenerateClassesRequest(BaseModel):
    course_id: uuid.UUID
    start_date: date
    end_date: date