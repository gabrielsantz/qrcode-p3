from fastapi import APIRouter, Depends
import uuid
from app.core.models import User
from app.core.security import get_current_user
from app.core.services.student import get_attendances_for_student
from app.core.schemas.student import StudentAttendanceResponse

router = APIRouter(prefix="/student", tags=["Estudante"])


@router.get("/attendances", response_model=StudentAttendanceResponse)
def get_student_attendances(
    student_id: uuid.UUID,
    current_user: User = Depends(get_current_user)
):
    return get_attendances_for_student(student_id)


