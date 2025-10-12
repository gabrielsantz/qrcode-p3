import fastapi
import uuid
from typing import List

from app.api.enrollment.schemas import EnrollmentCreate, EnrollmentRead
from app.api.enrollment import services as enrollment_service
from app.core.security import get_current_user
from app.core.models.user import User

router = fastapi.APIRouter()

@router.post("/enrollments", response_model=EnrollmentRead, status_code=fastapi.status.HTTP_201_CREATED, tags=["Matrículas"])
def enroll_student_in_course(enrollment_in: EnrollmentCreate, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role == 'student' and current_user.student_id != enrollment_in.student_id:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")

    enrollment = enrollment_service.create_enrollment(enrollment_in=enrollment_in)
    return enrollment

@router.delete("/enrollments/{enrollment_id}", status_code=fastapi.status.HTTP_204_NO_CONTENT, tags=["Matrículas"])
def unenroll_student(enrollment_id: uuid.UUID, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role == 'student':
        students_enrollments = enrollment_service.get_enrollments_by_student(student_id=current_user.student_id)
        if all(enrollment.id != enrollment_id for enrollment in students_enrollments):
            raise fastapi.HTTPException(status_code=403, detail="Acesso negado")

    enrollment_service.delete_enrollment(enrollment_id=enrollment_id)
    return

@router.get("/students/{student_id}/enrollments", response_model=List[EnrollmentRead], tags=["Estudantes"])
def read_enrollments_for_student(student_id: uuid.UUID, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role == 'student' and current_user.student_id != student_id:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    return enrollment_service.get_enrollments_by_student(student_id=student_id)
