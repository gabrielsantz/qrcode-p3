import uuid
from fastapi import APIRouter, status


from app.api.course.schemas import (
    CourseCreate, CourseRead, CourseUpdate,
    CourseScheduleCreate, CourseScheduleRead
)
from app.api.course import services as course_service

router = APIRouter(prefix="/courses", tags=["Cursos"])

@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_new_course(course_in: CourseCreate):
    return course_service.create_course(course_in=course_in)
    

@router.get("/", response_model=list[CourseRead])
def read_all_courses(skip: int = 0, limit: int = 100):
    return course_service.get_all_courses(skip=skip, limit=limit)

@router.get("/{course_id}", response_model=CourseRead)
def read_course(course_id: uuid.UUID):
    return course_service.get_course(course_id=course_id)

@router.put("/{course_id}", response_model=CourseRead)
def update_existing_course(course_id: uuid.UUID, course_update: CourseUpdate):
    return course_service.update_course(course_id=course_id, course_update=course_update)

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_course(course_id: uuid.UUID):
    course_service.delete_course(course_id=course_id)
    return

@router.post("/{course_id}/schedules", response_model=CourseScheduleRead, status_code=status.HTTP_201_CREATED, tags=["Horários"])
def add_schedule_to_course(course_id: uuid.UUID, schedule_in: CourseScheduleCreate):
    return course_service.create_schedule_for_course(course_id=course_id, schedule_in=schedule_in)

@router.get("/{course_id}/schedules", response_model=list[CourseScheduleRead], tags=["Horários"])
def read_schedules_for_course(course_id: uuid.UUID):
    return course_service.get_schedules_for_course(course_id=course_id)

@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Horários"])
def remove_schedule(schedule_id: uuid.UUID):
    course_service.delete_schedule(schedule_id=schedule_id)
    return