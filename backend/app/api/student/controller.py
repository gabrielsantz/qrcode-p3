import fastapi
import uuid

from app.core.models import User
from app.core.security import get_current_user
from app.api.student.services import get_attendances_for_student
from app.api.student.schemas import StudentAttendanceResponse

router = fastapi.APIRouter(prefix="/student", tags=["Estudante"])


@router.get("/attendances", response_model=StudentAttendanceResponse)
def get_student_attendances(
    student_id: uuid.UUID,
    current_user: User = fastapi.Depends(get_current_user)
):
    if current_user.role == 'student' and current_user.student_id != student_id:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    return get_attendances_for_student(student_id)


