import fastapi

from app.core.models import Attendance, User, UserRole, Student
from .schemas import ClassAttendance
from sqlalchemy.orm import joinedload
from app.infra.db.connection import get_db

def get_attendances_for_class(class_session_id: str, current_user: 'User') -> list[ClassAttendance]:
    if current_user.role not in [UserRole.ADMIN, UserRole.TEACHER]:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    with get_db() as db:

        attendances_from_db = db.query(Attendance).options(
            joinedload(Attendance.student).joinedload(Student.user)
        ).filter(
            Attendance.class_session_id == class_session_id
        ).all()

        formatted_attendances = []

        for att in attendances_from_db:
            arrival_time_str = att.marked_at.strftime('%H:%M:%S') if att.marked_at else None

            attendance_data = ClassAttendance(
                student_name=att.student.user.name,
                student_registration=att.student.user.registration,
                arrival_time=arrival_time_str,
                attended=att.present
            )
            formatted_attendances.append(attendance_data)

        return formatted_attendances