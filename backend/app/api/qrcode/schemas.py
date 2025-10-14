import uuid
from datetime import datetime
from pydantic import BaseModel

class QRTokenRequest(BaseModel):
    class_session_id: uuid.UUID


class QRTokenResponse(BaseModel):
    token: str
    class_session_id: uuid.UUID
    expires_at: datetime
    refresh_interval: int = 60

class QRScanRequest(BaseModel):
    token: str
    latitude: float
    longitude: float


class QRScanResponse(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    course_id: uuid.UUID
    class_session_id: uuid.UUID
    present: bool = True
    

    class Config:
        from_attributes = True
