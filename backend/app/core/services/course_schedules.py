import uuid
from fastapi import HTTPException, status

from app.infra.db.connection import get_db
from app.core.models import Course, CourseSchedule
from app.core.schemas.course_schedule import CourseScheduleCreate

def create_schedule_for_course(course_id: uuid.UUID, schedule_in: CourseScheduleCreate) -> CourseSchedule:
    with get_db() as db:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Curso não encontrado")

        existing_schedule = db.query(CourseSchedule).filter_by(
            course_id=course_id,
            day_of_week=schedule_in.day_of_week,
            start_time=schedule_in.start_time
        ).first()

        if existing_schedule:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Este horário já existe para este curso"
            )

        new_schedule = CourseSchedule(
            course_id=course_id,
            **schedule_in.dict() 
        )
        db.add(new_schedule)
        db.commit()
        db.refresh(new_schedule)
        return new_schedule

def get_schedules_for_course(course_id: uuid.UUID) -> list[CourseSchedule]:
    with get_db() as db:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Curso não encontrado")
        
        schedules = db.query(CourseSchedule).filter(CourseSchedule.course_id == course_id).order_by(CourseSchedule.day_of_week, CourseSchedule.start_time).all()
        return schedules

def delete_schedule(schedule_id: uuid.UUID) -> None:
    with get_db() as db:
        schedule = db.query(CourseSchedule).filter(CourseSchedule.id == schedule_id).first()
        if not schedule:
            raise HTTPException(status_code=404, detail="Horário não encontrado")
        
        db.delete(schedule)
        db.commit()
        return