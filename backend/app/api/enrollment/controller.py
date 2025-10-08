import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.enrollment.schemas import EnrollmentCreate, EnrollmentRead
from app.api.enrollment import services as enrollment_service
from app.infra.db.connection import get_db

router = APIRouter()

@router.post("/enrollments", response_model=EnrollmentRead, status_code=status.HTTP_201_CREATED, tags=["Matrículas"])
def enroll_student_in_course(enrollment_in: EnrollmentCreate):
    enrollment = enrollment_service.create_enrollment(enrollment_in=enrollment_in)
    return enrollment

@router.delete("/enrollments/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Matrículas"])
def unenroll_student(enrollment_id: uuid.UUID):
    enrollment_service.delete_enrollment(enrollment_id=enrollment_id)
    return

@router.get("/students/{student_id}/enrollments", response_model=List[EnrollmentRead], tags=["Estudantes"])
def read_enrollments_for_student(student_id: uuid.UUID):
    return enrollment_service.get_enrollments_by_student(student_id=student_id)

@router.get("/courses/{course_id}/enrollments", response_model=List[EnrollmentRead], tags=["Cursos"])
def read_enrollments_for_course(course_id: uuid.UUID):
    return enrollment_service.get_enrollments_by_course(course_id=course_id)