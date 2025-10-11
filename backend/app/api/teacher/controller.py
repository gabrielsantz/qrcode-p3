import fastapi

from app.api.teacher import services as teacher_service
from app.core.models import User
from app.core.security import get_current_user
from app.api.class_session.schemas import ClassSessionRead


router = fastapi.APIRouter()

@router.get("/teacher/class_session", response_model=list[ClassSessionRead])
def get_teacher_classes(current_user: 'User' = fastapi.Depends(get_current_user)):
    return teacher_service.get_classes_by_teacher(current_user=current_user)
