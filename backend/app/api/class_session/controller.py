import fastapi
import uuid
import io

from typing import List
from app.api.class_session.schemas import (
    ClassSessionRead
)
from app.api.class_session import services as class_session_service
from app.core.security import get_current_user
from app.core.models import User, UserRole

router = fastapi.APIRouter(prefix="/class_session", tags=["Aulas"])


@router.get("/", response_model=List[ClassSessionRead])
def get_all_classes(current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    return class_session_service.get_all_class_sessions()

@router.get("/{class_id}", response_model=ClassSessionRead)
def get_class_by_id(class_id: uuid.UUID, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role not in [ UserRole.ADMIN, UserRole.TEACHER ]:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    return class_session_service.get_class_session(class_id)

@router.get("/teacher/{teacher_id}")
def get_classes_by_teacher(teacher_id: uuid.UUID, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role not in [ UserRole.ADMIN, UserRole.TEACHER ]:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    return class_session_service.get_classes_by_teacher(teacher_id)

@router.get("/generate_pdf/{class_id}")
def generate_class_pdf(class_id: uuid.UUID, current_user: 'User' = fastapi.Depends(get_current_user)):
    if current_user.role not in [ UserRole.ADMIN, UserRole.TEACHER ]:
        raise fastapi.HTTPException(status_code=403, detail="Acesso negado")
    
    pdf_bytes, filename = class_session_service.generate_class_pdf(class_id)

    pdf_file = io.BytesIO(pdf_bytes)

    return fastapi.responses.StreamingResponse(
        pdf_file,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


