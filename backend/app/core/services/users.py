import fastapi
from app.infra.db.connection import get_db
from app.core.schemas.users import UserCreate
from app.core.models import User

from app.core.security import verify_password

def register_user(user_in: UserCreate) -> User:
    with get_db() as db:
        existing_user = db.query(User).filter(User.email == user_in.email).first()

        if existing_user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_409_CONFLICT,
                detail="Um usuário com este e-mail já existe.",
            )
        
        
        new_user = User(name = user_in.name, registration = user_in.registration, email=user_in.email, 
                        password=user_in.password, role=user_in.role)
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    
        return new_user

def authenticate_user(email: str, password: str) -> User | None:
    with get_db() as db:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None 
        
        if not verify_password(plain_password=password, hashed_password=user.hashed_password):
            return None 
            
        return user

