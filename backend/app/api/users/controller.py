import fastapi
from fastapi.params import Depends

from app.core.security import get_current_user

import app.api.users.services as users_service
from app.api.auth.schemas import UserPublic, UserUpdate
from app.core.models.user import User


router = fastapi.APIRouter(prefix="/users", tags=["Usuários"])

@router.post("/activate", status_code=fastapi.status.HTTP_200_OK)
def activate_user(user_id: str, current_user: 'User' = Depends(get_current_user)):
    users_service.activate_user(user_id=user_id, current_user=current_user)

@router.post("/deactivate", status_code=fastapi.status.HTTP_200_OK)
def deactivate_user(user_id: str, current_user: 'User' = Depends(get_current_user)):
    users_service.deactivate_user(user_id=user_id, current_user=current_user)

@router.put("/{user_id}", response_model=UserPublic)
def update_user(user_id: str, user_in: UserUpdate, current_user: 'User' = Depends(get_current_user)):
    return users_service.update_user(user_id=user_id, user_in=user_in, current_user=current_user)

@router.get("/inactive_users", response_model=list[UserPublic])
def get_inactive_users(current_user: 'User' = Depends(get_current_user)):
    return users_service.get_inactive_users(current_user=current_user)

@router.get("/active_users", response_model=list[UserPublic])
def get_active_users(current_user: 'User' = Depends(get_current_user)):
    return users_service.get_active_users(current_user=current_user, active=True)

@router.delete("/{user_id}", status_code=fastapi.status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, current_user: 'User' = Depends(get_current_user)):
    return users_service.delete_user(user_id=user_id, current_user=current_user)