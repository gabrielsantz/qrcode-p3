import fastapi

from app.core.models.user import User
from app.core.security import get_current_user

import app.api.attendance.services as attendance_service


router = fastapi.APIRouter(prefix="/attendance", tags=["Presenças"])

@router.get("/class_session/{class_session_id}")
def get_attendance_for_class(class_session_id: str, current_user: 'User' = fastapi.Depends(get_current_user)):
    return attendance_service.get_attendances_for_class(class_session_id, current_user)
