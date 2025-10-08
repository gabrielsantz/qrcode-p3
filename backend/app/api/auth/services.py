import fastapi

from app.infra.db.connection import get_db
from app.api.auth.schemas import UserCreate, UserPublic
from app.core.models import User, Student, Teacher, UserRole
from app.core.utils.validate_registration import validate_user_registration
from app.core import security

def register_user(user_in: UserCreate) -> UserPublic:
    with get_db() as db:
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_409_CONFLICT,
                detail="Um usuário com este e-mail já existe.",
            )
        
        validate_user_registration(user_in)
        
        if user_in.registration == "":
            user_in.registration = None
        
        hashed_password = security.hash_password(user_in.password)
        new_user = User(
            name=user_in.name,
            registration=user_in.registration,
            email=user_in.email,
            hashed_password=hashed_password,
            role=user_in.role
        )
        db.add(new_user)
        
        if new_user.role == UserRole.STUDENT:
            new_user.student = Student()

        elif new_user.role == UserRole.TEACHER:
            new_user.teacher = Teacher()

        
        db.commit()  
        db.refresh(new_user) 
        
        return new_user
    
def authenticate_user(email: str, password: str) -> UserPublic | None:
    with get_db() as db:
        existing_user = db.query(User).filter(User.email == email).first()

        if not existing_user or not security.verify_password(
            plain_password=password, hashed_password=existing_user.hashed_password
        ):
            return None 

            
        return existing_user
    

def activate_user(user_id: str, current_user: 'User'):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem ativar usuários."
        )
    
    with get_db() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado."
            )
        
        if user.is_active:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_400_BAD_REQUEST,
                detail="O usuário já está ativo."
            )
        
        if user.role not in [UserRole.STUDENT, UserRole.TEACHER]:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_400_BAD_REQUEST,
                detail="Apenas estudantes ou professores podem ser ativados."
            )
        
        
        user.is_active = True
        
        db.commit()
        db.refresh(user)
        
        return user