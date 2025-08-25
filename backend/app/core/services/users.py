import fastapi

from app.infra.db.connection import get_db
from app.core.schemas.users import UserCreate
from app.core.models import User
from app.core import security
from app.core.services import crud_users

def register_user(user_in: UserCreate) -> User:
    with get_db() as db:
        existing_user = crud_users.get_user_by_email(db, email=user_in.email)
        if existing_user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_409_CONFLICT,
                detail="Um usuário com este e-mail já existe.",
            )
        
        hashed_pass = security.hash_password(user_in.password)
        
        new_user = crud_users.create_user(db, user_in=user_in, hashed_password=hashed_pass)
    
        return new_user
    
def authenticate_user(email: str, password: str) -> User | None:
    with get_db() as db:
        user = crud_users.get_user_by_email(db, email=email)
        
        if not user or not security.verify_password(
            plain_password=password, hashed_password=user.hashed_password
        ):
            return None 
            
        return user