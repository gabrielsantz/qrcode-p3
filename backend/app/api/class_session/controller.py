import uuid
from typing import List
from fastapi import APIRouter, Depends, status

from app.api.class_session.schemas import (
    ClassSessionCreate,
    ClassSessionRead,
    GenerateClassesRequest
)
from app.api.class_session import services as class_session_service
from app.core.security import get_current_user
from app.core.models import User

router = APIRouter(prefix="/class_session", tags=["Aulas"])

@router.post("/", response_model=ClassSessionRead, status_code=status.HTTP_201_CREATED)
def create_class(
    class_in: ClassSessionCreate
):    
    return class_session_service.create_class_session(class_in)

@router.get("/{class_id}", response_model=ClassSessionRead)
def get_class_by_id(class_id: uuid.UUID):
    return class_session_service.get_class_session(class_id)

@router.get("/teacher/{teacher_id}")
def get_classes_by_teacher(teacher_id: uuid.UUID):
    return class_session_service.get_classes_by_teacher(teacher_id)

@router.post("/generate", response_model=List[ClassSessionRead])
def generate_classes_from_schedules(
    request: GenerateClassesRequest
):
    return class_session_service.generate_classes_from_schedules(request)


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(
    class_id: uuid.UUID,
    current_user: User = Depends(get_current_user)
):
    class_session_service.delete_class_session(class_id)