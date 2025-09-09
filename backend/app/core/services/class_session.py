import uuid
from datetime import timedelta
from typing import List
from sqlalchemy import and_
from sqlalchemy.orm import joinedload
from fastapi import HTTPException, status

from app.infra.db.connection import get_db
from app.core.utils import class_session as class_utils
from app.core.models import ClassSession, Course, CourseSchedule, Attendance, Teacher
from app.core.schemas.class_session import (
    ClassSessionCreate , GenerateClassesRequest, ClassSessionRead
)

def create_class_session(class_in: ClassSessionCreate) -> ClassSession:
    with get_db() as db:
        course = db.query(Course).filter(Course.id == class_in.course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Curso não encontrado")

 
        existing_class = db.query(ClassSession).filter(
            and_(
                ClassSession.course_id == class_in.course_id,
                ClassSession.date == class_in.date,
                ClassSession.start_time == class_in.start_time 
            )
        ).first()

        if existing_class:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Já existe uma aula neste horário"
            )

        new_class = ClassSession(
            course_id=class_in.course_id,
            course_schedule_id=class_in.course_schedule_id,
            date=class_in.date,
            start_time=class_in.start_time,
            end_time=class_in.end_time,
            title=class_in.title or f"Aula - {class_in.date.strftime('%d/%m/%Y')}",
            description=class_in.description,
        )

        db.add(new_class)
        db.commit()
        db.refresh(new_class)
        return new_class
    
def get_all_class_sessions() -> List[ClassSession]:
    with get_db() as db:
        classes = db.query(ClassSession).all()
        return classes

def get_classes_by_teacher(teacher_id: uuid.UUID) -> List[ClassSessionRead]:
    with get_db() as db:
        class_sessions = (
            db.query(ClassSession)
            .join(Course)
            .filter(Course.teacher_id == teacher_id)
            .order_by(ClassSession.date.desc())
            .all()
        )

        return [ClassSessionRead.model_validate(cls) for cls in class_sessions]

def generate_classes_from_schedules(request: GenerateClassesRequest) -> List[ClassSession]:
    with get_db() as db:
        schedules = db.query(CourseSchedule).filter(
            and_(
                CourseSchedule.course_id == request.course_id,
            )
        ).all()

        if not schedules:
            raise HTTPException(
                status_code=404, 
                detail="Nenhum horário ativo encontrado para este curso"
            )

        created_classes = []
        current_date = request.start_date

        while current_date <= request.end_date:
            for schedule in schedules:
                if class_utils.to_day_of_week(current_date.weekday()) == schedule.day_of_week:
                    existing_class = db.query(ClassSession).filter(
                        and_(
                            ClassSession.course_id == request.course_id,
                            ClassSession.date == current_date,
                            ClassSession.start_time == schedule.start_time,
                            ClassSession.end_time == schedule.end_time
                        )
                    ).first()

                    if not existing_class:
                        new_class = ClassSession(
                            course_id=request.course_id,
                            course_schedule_id=schedule.id,
                            date=current_date,
                            start_time=schedule.start_time,
                            end_time=schedule.end_time,
                            title=f"Aula - {current_date.strftime('%d/%m/%Y')}",
                        )
                        db.add(new_class)
                        created_classes.append(new_class)

            current_date += timedelta(days=1)

        db.commit()
        
        for class_session in created_classes:
            db.refresh(class_session)

        return created_classes



def delete_class_session(class_id: uuid.UUID) -> None:
    with get_db() as db:
        class_session = db.query(Attendance).filter(Attendance.class_session_id == class_id)

        if not class_session.first():
            raise HTTPException(status_code=404, detail="Aula não encontrada.")
    
        db.delete(class_session)
        db.commit()

