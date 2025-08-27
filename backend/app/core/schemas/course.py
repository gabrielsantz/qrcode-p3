import uuid
import datetime
from typing import Optional
from app.core.models.course_schedule import DayOfWeek
from app.core.models import Teacher
from .course_schedule import CourseScheduleRead
from pydantic import BaseModel, model_validator

class TeacherInfo(BaseModel):
    id: uuid.UUID
    name: str 

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def add_name_from_user_relation(cls, data: any) -> any:
          if isinstance(data, Teacher):
            if hasattr(data, 'user') and data.user:
                setattr(data, 'name', data.user.name)
        
            return data

class ScheduleForCourseCreate(BaseModel):
    day_of_week: DayOfWeek
    start_time: datetime.time
    end_time: Optional[datetime.time] = None

class CourseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    teacher_id: uuid.UUID
    schedules: Optional[list[ScheduleForCourseCreate]] = []

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CourseRead(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    teacher: TeacherInfo
    
    schedules: list[CourseScheduleRead] = []

    class Config:
        from_attributes = True 