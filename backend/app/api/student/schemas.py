import uuid
from pydantic import BaseModel

class AttendanceSchema(BaseModel):
    id: uuid.UUID
    student_name: str
    course_name: str
    marked_at: str | None
    date: str
    present: bool

    class Config:
        from_attributes = True


class StudentAttendanceResponse(BaseModel):
    attendances: list[AttendanceSchema]
