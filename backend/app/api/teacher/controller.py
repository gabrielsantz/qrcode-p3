import fastapi

from app.api.teacher import services as teacher_service
from app.core.security import get_current_user
from app.api.class_session.schemas import ClassSessionRead
from app.api.teacher.schemas import TeacherPublic
from app.core.models import User


router = fastapi.APIRouter()

@router.get("/teacher", response_model=list[TeacherPublic])
def get_teachers(current_user: 'User' = fastapi.Depends(get_current_user)):
    return teacher_service.get_all_teachers(current_user=current_user)

@router.get("/teacher/class_session", response_model=list[ClassSessionRead])
def get_teacher_classes(current_user: 'User' = fastapi.Depends(get_current_user)):
    return teacher_service.get_classes_by_teacher(current_user=current_user)
