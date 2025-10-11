import fastapi
from fastapi.params import Depends
from app.core.security import create_access_token, get_current_user
from app.api.auth import services as auth_service

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.core.models import User

from app.api.auth.schemas import UserCreate, UserPublic, Token, UserLogin

router = fastapi.APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/register", response_model=UserPublic, status_code=fastapi.status.HTTP_201_CREATED)
def register_user_route(user_in: UserCreate):
    user = auth_service.register_user(user_in=user_in)
    return user

@router.post("/token", response_model=Token)
def login_for_access_token_route(
    login_data: UserLogin
):
    user = auth_service.authenticate_user(
        email=login_data.email, password=login_data.password
    )
    if not user:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Conta não ativada",
        )

    token_data = {
        "sub": str(user.id),
        "role": user.role.value
    }
    
    if hasattr(user, 'student_id') and user.student_id is not None:
        token_data["student_id"] = str(user.student_id)
    
    if hasattr(user, 'teacher_id') and user.teacher_id is not None:
        token_data["teacher_id"] = str(user.teacher_id)
    
    access_token = create_access_token(data=token_data)
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserPublic)
def read_current_user(current_user: 'User' = Depends(get_current_user)):
    return current_user
