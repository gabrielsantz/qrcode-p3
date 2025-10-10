from pydantic import BaseModel, Field
from typing import Optional

class ClassAttendance(BaseModel):
    student_name: str = Field()
    student_registration: str = Field()
    arrival_time: Optional[str] = Field(None)
    attended: bool = Field()