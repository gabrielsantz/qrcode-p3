import bcrypt
import datetime
import jwt
from app.infra.config import settings

def hash_password(plain_password: str) -> str:
    password_bytes = plain_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    hashed_string = hashed_bytes.decode('utf-8')
    
    return hashed_string

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        payload=to_encode, 
        key=settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt