import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.schemas.course import CourseCreate, CourseRead, CourseUpdate
from app.core.services import courses as course_service

router = APIRouter(prefix="/courses", tags=["Cursos"])

@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_new_course(course_in: CourseCreate):
    course = course_service.create_course(course_in=course_in)
    return course

@router.get("/", response_model=List[CourseRead])
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