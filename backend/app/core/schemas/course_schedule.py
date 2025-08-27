import uuid
import datetime
from pydantic import BaseModel
from typing import Optional

from app.core.models.course_schedule import DayOfWeek


class CourseScheduleCreate(BaseModel):
    day_of_week: DayOfWeek
    start_time: datetime.time
    end_time: Optional[datetime.time] = None

class CourseScheduleRead(BaseModel):
    id: uuid.UUID
    day_of_week: DayOfWeek
    start_time: datetime.time
    end_time: Optional[datetime.time]

    class Config:
        from_attributes = True 