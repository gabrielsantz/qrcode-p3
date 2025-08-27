from app.core.models import User, UserRole, Student, Teacher
from sqlalchemy.orm import Session
from app.core.schemas.users import UserCreate

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate, hashed_password: str) -> User:
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