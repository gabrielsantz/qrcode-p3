import uuid
from datetime import datetime
from pydantic import BaseModel

class QRTokenRequest(BaseModel):
    course_id: uuid.UUID


class QRTokenResponse(BaseModel):
    token: str
    course_id: uuid.UUID
    expires_at: datetime
    refresh_interval: int = 60

class QRScanRequest(BaseModel):
    token: str


class QRScanResponse(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    course_id: uuid.UUID
    class_session_id: uuid.UUID
    present: bool = True
    date: datetime
    

    class Config:
        from_attributes = True
