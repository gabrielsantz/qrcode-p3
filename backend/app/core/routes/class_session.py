import uuid
from typing import List
from fastapi import APIRouter, Depends, status

from app.core.schemas.class_session import (
    ClassSessionCreate,
    ClassSessionRead,
    GenerateClassesRequest
)
from app.core.services import class_session as class_service
from app.core.security import get_current_user
from app.core.models import User

router = APIRouter(prefix="/classes", tags=["Aulas"])

@router.post("/", response_model=ClassSessionRead, status_code=status.HTTP_201_CREATED)
def create_class(
    class_in: ClassSessionCreate
):    
    return class_service.create_class_session(class_in)

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