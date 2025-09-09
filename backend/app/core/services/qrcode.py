from datetime import datetime, timedelta
import uuid
import jwt
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload

from app.core.models import User, ClassSession, Course, Teacher, UserRole, Student, Enrollment, Attendance
from app.core.schemas.qrcode import QRTokenRequest, QRTokenResponse, QRScanRequest, QRScanResponse
from app.infra.db.connection import get_db
from app.infra.config import settings

def generate_qr_token(request: QRTokenRequest, current_user: User) -> QRTokenResponse:
    with get_db() as db:
        class_session = db.query(ClassSession).options(
            joinedload(ClassSession.course).joinedload(Course.teacher).joinedload(Teacher.user)
        ).filter(ClassSession.id == request.class_session_id).first()
        
        if not class_session:
            raise HTTPException(status_code=404, detail="Aula não encontrada")

        if (current_user.role != UserRole.ADMIN and 
            class_session.course.teacher.user_id != current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Apenas o professor da aula pode gerar códigos QR"
            )


        now = datetime.utcnow()
        expires_at = now + timedelta(seconds=60)
        
        payload = {
            "class_session_id": str(request.class_session_id),
            "course_id": str(class_session.course_id),
            "teacher_id": str(current_user.id),
            "exp": int(expires_at.timestamp()),
            "type": "qr_attendance"
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

        return QRTokenResponse(
            token=token,
            class_session_id=request.class_session_id,
            course_id=class_session.course_id,
            course_name=class_session.course.name,
            class_title=class_session.title or f"Aula - {class_session.date}",
            class_date=class_session.date,
            expires_at=expires_at,
            refresh_interval=30
        )


def scan_qr_code(scan_data: QRScanRequest, current_user: User) -> QRScanResponse:
    with get_db() as db:
        if current_user.role != UserRole.STUDENT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Apenas estudantes podem marcar presença"
            )
        
        try:
            payload = jwt.decode(
                scan_data.token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM],
                leeway=timedelta(seconds=30)
            )            
            
            if payload.get("type") != "qr_attendance":
                raise HTTPException(status_code=400, detail="Token inválido")
            
            class_session_id = uuid.UUID(payload.get("class_session_id"))
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Código QR expirado. Solicite um novo código ao professor."
            )
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=400, detail="Token inválido")

        student = db.query(Student).options(
            joinedload(Student.user)
        ).filter(Student.user_id == current_user.id).first()
        
        if not student:
            raise HTTPException(status_code=404, detail="Registro de estudante não encontrado")
        
        class_session = db.query(ClassSession).options(
            joinedload(ClassSession.course)
        ).filter(ClassSession.id == class_session_id).first()
        
        if not class_session:
            raise HTTPException(status_code=404, detail="Aula não encontrada")
        
        enrollment = db.query(Enrollment).filter(
            Enrollment.student_id == student.id,
            Enrollment.course_id == class_session.course_id
        ).first()
        
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Você não está matriculado no curso '{class_session.course.name}'"
            )
        
        existing_attendance = db.query(Attendance).filter(
            Attendance.student_id == student.id,
            Attendance.class_session_id == class_session_id
        ).first()
        
        if existing_attendance:
            existing_attendance.present = True
            db.commit()
        
            return QRScanResponse(
                id=existing_attendance.id,
                student_id=existing_attendance.student_id,
                course_id=class_session.course_id,
                class_session_id=class_session.id,
                present=True,
                date=existing_attendance.date or datetime.utcnow(),
                message="Presença já foi marcada para esta aula"
            )

        new_attendance = Attendance(
            student_id=student.id,
            course_id=class_session.course_id,
            class_session_id=class_session.id,
            present=True
        )

        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)

        return QRScanResponse(
            id=new_attendance.id,
            student_id=new_attendance.student_id,
            course_id=new_attendance.course_id,
            class_session_id=new_attendance.class_session_id,
            present=True,
            date=new_attendance.date or datetime.utcnow(),
            message="Presença registrada com sucesso"
        )
