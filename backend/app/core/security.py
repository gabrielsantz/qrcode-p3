import bcrypt
import datetime
import jwt
import fastapi

from app.infra.config import settings
from app.infra.db.connection import get_db

from app.core.models import User, UserRole, Student, Teacher



def hash_password(plain_password: str) -> str:
    password_bytes = plain_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_current_user(
    request: fastapi.Request
) -> 'User':
    with get_db() as db:
        token = request.cookies.get("access_token")
        if not token:
            raise fastapi.HTTPException(status_code=401, detail="Not authenticated")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            id: str = payload.get("sub")
            if id is None:
                raise fastapi.HTTPException(status_code=401, detail="Invalid token payload")
        except jwt.PyJWTError:
            raise fastapi.HTTPException(status_code=401, detail="Token has expired or is invalid")

        user = db.query(User).filter(User.id == id).first()
        if user is None:
            raise fastapi.HTTPException(status_code=401, detail="User not found")
        
        if(user.role == UserRole.STUDENT):
            user.student_id = db.query(Student).filter(Student.user_id == user.id).first().id
        elif(user.role == UserRole.TEACHER):
            user.teacher_id = db.query(Teacher).filter(Teacher.user_id == user.id).first().id

        return user