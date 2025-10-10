from app.infra.db.connection import get_db
from app.core.models import Attendance, Student
from sqlalchemy.orm import joinedload
from app.api.student.schemas import StudentAttendanceResponse
import datetime

def get_attendances_for_student(student_id: int) -> StudentAttendanceResponse:
    with get_db() as db:
        attendances = db.query(Attendance).filter(Attendance.student_id == student_id).options(
        joinedload(Attendance.student).joinedload(Student.user), 
        joinedload(Attendance.course_),
        joinedload(Attendance.class_session)
    ).all()
    
    formatted_attendances = []
    for at in attendances:
        if at.class_session.date < datetime.date.today():
            formatted_attendances.append({
                "id": at.id,
                "student_name": at.student.user.name, 
                "course_name": at.course_.name,
                "present": at.present,
                "date": at.class_session.date.isoformat(),
            })
            if at.marked_at:
                formatted_attendances[-1]["marked_at"] = at.marked_at.isoformat()
            else:
                formatted_attendances[-1]["marked_at"] = None

    return StudentAttendanceResponse(attendances=formatted_attendances)


