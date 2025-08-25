from sqlalchemy.orm import Session
from app.core.models import User
from app.core.schemas.users import UserCreate
from app.infra.db.connection import get_db

def get_user_by_email(email: str) -> User | None:
    with get_db() as db:
        return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate, hashed_password: str) -> User:
    new_user = User(name=user_in.name, registration=user_in.registration, email=user_in.email,
        hashed_password=hashed_password, role=user_in.role)

    with get_db() as db:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    return new_user