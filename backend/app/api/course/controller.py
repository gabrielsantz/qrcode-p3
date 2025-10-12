import fastapi
import uuid


from app.api.course.schemas import (
    CourseCreate, CourseRead, CourseUpdate
)
from app.api.course import services as course_service
from app.core.security import get_current_user
from app.core.models import User, UserRole

router = fastapi.APIRouter(prefix="/courses", tags=["Matérias"])

@router.post("/", response_model=CourseRead, status_code=fastapi.status.HTTP_201_CREATED)
def create_new_course(course_in: CourseCreate, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")

    return course_service.create_course(course_in=course_in)
    

@router.get("/", response_model=list[CourseRead])
def read_all_courses(skip: int = 0, limit: int = 100, current_user: 'User' = fastapi.Depends(get_current_user)):
    return course_service.get_all_courses(skip=skip, limit=limit)


@router.put("/{course_id}", response_model=CourseRead)
def update_existing_course(course_id: uuid.UUID, course_update: CourseUpdate, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")

    return course_service.update_course(course_id=course_id, course_update=course_update)

@router.delete("/{course_id}", status_code=fastapi.status.HTTP_204_NO_CONTENT)
def delete_existing_course(course_id: uuid.UUID, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")

    course_service.delete_course(course_id=course_id)
    return
