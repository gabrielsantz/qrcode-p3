import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from pydantic import model_validator

from app.api.class_session.schemas import (
    ClassSessionCreate,
    ClassSessionRead,
    GenerateClassesRequest
)
from app.api.class_session import services as class_service
from app.core.security import get_current_user
from app.core.models import User

router = APIRouter(prefix="/classes", tags=["Aulas"])

@router.post("/", response_model=ClassSessionRead, status_code=status.HTTP_201_CREATED)
def create_class(
    class_in: ClassSessionCreate
):    
    return class_service.create_class_session(class_in)

@router.get("/", response_model=List[ClassSessionRead])
def get_all_classes():
    return class_service.get_all_class_sessions()

@router.get("/teacher/{teacher_id}")
def get_classes_by_teacher(teacher_id: uuid.UUID):
    return class_service.get_classes_by_teacher(teacher_id)

@router.post("/generate", response_model=List[ClassSessionRead])
def generate_classes_from_schedules(
    request: GenerateClassesRequest
):
    return class_service.generate_classes_from_schedules(request)


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(
    class_id: uuid.UUID,
    current_user: User = Depends(get_current_user)
):
    class_service.delete_class_session(class_id)