import fastapi

from app.infra.db.connection import get_db
from app.core.schemas.users import UserCreate
from app.core.models import User, Student, Teacher, UserRole
from app.core import security

def register_user(user_in: UserCreate) -> User:
    with get_db() as db:
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_409_CONFLICT,
                detail="Um usuário com este e-mail já existe.",
            )
        
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
    
def authenticate_user(email: str, password: str) -> User | None:
    with get_db() as db:
        existing_user = db.query(User).filter(User.email == email).first()
        
        if not existing_user or not security.verify_password(
            plain_password=password, hashed_password=existing_user.hashed_password
        ):
            return None 
            
        return existing_user