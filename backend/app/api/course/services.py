from operator import and_
import uuid
from typing import List
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status

from app.infra.db.connection import get_db
from app.core.models import Course, Teacher, CourseSchedule
from app.api.course.schemas import CourseCreate, CourseUpdate, CourseRead, CourseScheduleCreate, CourseScheduleRead
from app.api.class_session.schemas import GenerateClassesRequest
from app.api.class_session.services import generate_classes_from_schedules

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

        existing_course = db.query(Course).filter(
            Course.name == course_in.name,
            Course.teacher_id == course_in.teacher_id,
            Course.start_date == course_in.start_date,
            Course.end_date == course_in.end_date
        ).first()
        if existing_course:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Já existe um curso com este nome, professor e datas"
            )

        new_course = Course(
            name=course_in.name,
            description=course_in.description,
            teacher_id=course_in.teacher_id,
            start_date = course_in.start_date,
            end_date = course_in.end_date
        )
        db.add(new_course)


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

        db.refresh(new_course)

        generate_classes_from_schedules(GenerateClassesRequest.model_validate({
            "course_id": new_course.id,
            "start_date": course_in.start_date,
            "end_date": course_in.end_date
        }))

        return CourseRead.model_validate(new_course)

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
        course = get_course_by_id(db=db, course_id=course_id)
        db.delete(course)
        db.commit()
        return
    

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