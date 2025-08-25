import fastapi
from app.core.security import create_access_token
from app.core.services.users import register_user, authenticate_user


from app.core.schemas.users import UserCreate, UserPublic, Token, UserLogin

router = fastapi.APIRouter()

@router.post("/register", response_model=UserPublic, status_code=fastapi.status.HTTP_201_CREATED)
def register_user_route(user_in: UserCreate):
    user = register_user(user_in=user_in)
    return user

@router.post("/token", response_model=Token)
def login_for_access_token_route(
    login_data: UserLogin,
    response: fastapi.Response
):
    user = authenticate_user(
        email=login_data.email, password=login_data.password
    )
    
    if not user:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict"
    )
    
    return {"message": "Login realizado com sucesso"}