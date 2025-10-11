import fastapi
from app.infra.db.connection import get_db
from app.core.models.class_session import ClassSession
from sqlalchemy.orm import joinedload

from app.core.models import Course, User, UserRole, Teacher
from app.api.teacher.schemas import TeacherPublic
from app.api.class_session.schemas import ClassSessionRead

def get_all_teachers(current_user: 'User'):
    if(current_user.role != UserRole.ADMIN):
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    with get_db() as db:
        teachers = db.query(Teacher).options(joinedload(Teacher.user)).all()
        return [TeacherPublic.model_validate(t) for t in teachers]

def get_classes_by_teacher(current_user: 'User'):
    teacher_id = current_user.teacher_id
    with get_db() as db:
        classes = (
            db.query(ClassSession)
            .join(ClassSession.course)
            .options(
                joinedload(ClassSession.course).joinedload(Course.teacher)
            )
            .filter(Course.teacher_id == teacher_id)
            .all()
        )


        return [ClassSessionRead.model_validate(c) for c in classes]