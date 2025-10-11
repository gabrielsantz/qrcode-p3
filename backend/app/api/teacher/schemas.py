import uuid
from pydantic import BaseModel

class UserForTeacher(BaseModel):
    id: uuid.UUID
    name: str
    email: str

    class Config:
        from_attributes = True

# The main schema for the teacher response
class TeacherPublic(BaseModel):
    id: uuid.UUID
    user: UserForTeacher

    class Config:
        from_attributes = True