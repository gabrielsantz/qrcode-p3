import uuid
from typing import List
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status

from app.infra.db.connection import get_db
from app.core.models import Course, Teacher, CourseSchedule
from app.core.schemas.course import CourseCreate, CourseUpdate

def get_course_by_id(db: Session, course_id: uuid.UUID) -> Course:
    course = (
        db.query(Course)
        .options(
            joinedload(Course.teacher).joinedload(Teacher.user), 
            joinedload(Course.schedules)
        )
        .filter(Course.id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado")
    return course

def create_course(course_in: CourseCreate) -> Course:
    with get_db() as db:
        teacher = db.query(Teacher).filter(Teacher.id == course_in.teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=404, detail="Professor não encontrado")

        new_course = Course(
            name=course_in.name,
            description=course_in.description,
            teacher_id=course_in.teacher_id
        )
        db.add(new_course)

        if course_in.schedules:
            for schedule_data in course_in.schedules:
                new_schedule = CourseSchedule(
                    course=new_course,
                    day_of_week=schedule_data.day_of_week,
                    start_time=schedule_data.start_time,
                    end_time=schedule_data.end_time
                )
                db.add(new_schedule)

        db.commit()

        new_course = (
            db.query(Course)
            .options(
                joinedload(Course.teacher).joinedload(Teacher.user),
                joinedload(Course.schedules)
            )
            .filter(Course.id == new_course.id)
            .first()
        )

        return new_course

def get_course(course_id: uuid.UUID) -> Course:
    with get_db() as db:
        course = (
            db.query(Course)
            .options(
                joinedload(Course.teacher).joinedload(Teacher.user),
                joinedload(Course.schedules)
            )
            .filter(Course.id == course_id)
            .first()
        )
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado")
        return course


def get_all_courses(skip: int = 0, limit: int = 100) -> List[Course]:
    with get_db() as db:
        courses = (
            db.query(Course)
            .options(
                joinedload(Course.teacher).joinedload(Teacher.user),
                joinedload(Course.schedules)
            )
            .order_by(Course.name)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        return courses



def update_course(course_id: uuid.UUID, course_update: CourseUpdate) -> Course:
    with get_db() as db:
        course = (
            db.query(Course)
            .options(joinedload(Course.teacher).joinedload(Teacher.user))
            .filter(Course.id == course_id)
            .first()
        )
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado")
        course.teacher.name = course.teacher.user.name

        
        update_data = course_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(course, key, value)
            
        db.commit()
        db.refresh(course)
        course.teacher.name = course.teacher.user.name
        return course

def delete_course(course_id: uuid.UUID) -> None:
    with get_db() as db:
        course = get_course(course_id=course_id)
        db.delete(course)
        db.commit()
        return