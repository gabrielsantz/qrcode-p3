from fastapi import APIRouter, HTTPException, status
from app.core.security import create_access_token
from app.core.services.users import register_user, authenticate_user


from app.core.schemas.users import UserCreate, UserPublic, Token, UserLogin

router = APIRouter()

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register_user_route(user_in: UserCreate):
    user = register_user(user_in=user_in)
    return user

@router.post("/token", response_model=Token)
def login_for_access_token_route(
    login_data: UserLogin
):
    user = authenticate_user(
        email=login_data.email, password=login_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    
    return {"access_token": access_token, "token_type": "bearer"}