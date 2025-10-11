from app.infra.db.connection import get_db
from app.core.models.class_session import ClassSession
from sqlalchemy.orm import joinedload

from app.core.models import Course, User
from app.api.class_session.schemas import ClassSessionRead

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