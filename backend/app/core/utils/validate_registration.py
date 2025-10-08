import fastapi
from app.api.auth.schemas import UserCreate
from app.core.models import UserRole


def validate_user_registration(user_in: UserCreate) -> None:        
    if not user_in.name:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="O nome é obrigatório."
        )
    if not user_in.email:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="O e-mail é obrigatório."
        )
    if not user_in.password:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="A senha é obrigatória."
        )
    if not user_in.role:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="O papel do usuário é obrigatório."
        )

    if user_in.role == UserRole.STUDENT and not user_in.registration:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="A matrícula é obrigatória para alunos."
        )

    if user_in.role != UserRole.STUDENT and user_in.registration is not None:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="A matrícula só deve ser fornecida para alunos."
        )

    

