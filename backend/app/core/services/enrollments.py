import uuid
from typing import List
from sqlalchemy.orm import joinedload
from fastapi import HTTPException, status

from app.infra.db.connection import get_db
from app.core.models import Enrollment, Student, Course, ClassSession, Attendance
from app.core.schemas.enrollment import EnrollmentCreate, EnrollmentRead

def create_enrollment(enrollment_in: EnrollmentCreate) -> Enrollment:    
    with get_db() as db:
        student = db.query(Student).filter(Student.id == enrollment_in.student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Aluno não encontrado")

        course = db.query(Course).filter(Course.id == enrollment_in.course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Curso não encontrado")

        existing_enrollment = db.query(Enrollment).filter_by(
            student_id=enrollment_in.student_id,
            course_id=enrollment_in.course_id
        ).first()
        
        if existing_enrollment:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="O aluno já está matriculado neste curso"
            )

        new_enrollment = Enrollment(
            student_id=enrollment_in.student_id,
            course_id=enrollment_in.course_id
        )
        db.add(new_enrollment)
        db.commit()
        db.refresh(new_enrollment)
        new_enrollment.student.name = student.user.name
        new_enrollment.student.registration = student.user.registration

        ## Cria as presenças iniciais para o aluno no curso
        class_sessions = db.query(ClassSession).filter(ClassSession.course_id == course.id).all()
        for cs in class_sessions:
            attendance = Attendance(
                student_id=student.id,
                course_id=course.id,
                class_session_id=cs.id,
                present=False
            )
            db.add(attendance)
            db.commit()


        
        return EnrollmentRead.model_validate(new_enrollment)

def get_enrollments_by_student(student_id: uuid.UUID) -> List[Enrollment]:
    with get_db() as db:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Aluno não encontrado")
            
        enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).options(
            joinedload(Enrollment.course_),
            joinedload(Enrollment.student).joinedload(Student.user)
        ).all()
        
        for en in enrollments:
            en.student.name = en.student.user.name
            
        return enrollments
    
def get_enrollments_by_course(course_id: uuid.UUID) -> List[Enrollment]:
    with get_db() as db:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Curso não encontrado")

        enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).options(
            joinedload(Enrollment.student).joinedload(Student.user),
            joinedload(Enrollment.course_)
        ).all()
        
        for en in enrollments:
            en.student.name = en.student.user.name

        return enrollments

def delete_enrollment(enrollment_id: uuid.UUID) -> None:
    with get_db() as db:
        enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
        if not enrollment:
            raise HTTPException(status_code=404, detail="Matrícula não encontrada")
        
        db.delete(enrollment)
        db.commit()
        return