import uuid
from fastapi import APIRouter, status


from app.api.course.schemas import (
    CourseCreate, CourseRead, CourseUpdate
)
from app.api.course import services as course_service

router = APIRouter(prefix="/courses", tags=["Cursos"])

@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_new_course(course_in: CourseCreate):
    return course_service.create_course(course_in=course_in)
    

@router.get("/", response_model=list[CourseRead])
def read_all_courses(skip: int = 0, limit: int = 100):
    return course_service.get_all_courses(skip=skip, limit=limit)


@router.put("/{course_id}", response_model=CourseRead)
def update_existing_course(course_id: uuid.UUID, course_update: CourseUpdate):
    return course_service.update_course(course_id=course_id, course_update=course_update)

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_course(course_id: uuid.UUID):
    course_service.delete_course(course_id=course_id)
    return
