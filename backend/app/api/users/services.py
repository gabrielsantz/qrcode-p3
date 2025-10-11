import fastapi

from app.core.models.user import User, UserRole
from app.api.auth.schemas import UserPublic, UserUpdate
from app.infra.db.connection import get_db

def activate_user(user_id: str, current_user: 'User'):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem ativar usuários."
        )
    
    with get_db() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado."
            )
        
        if user.is_active:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_400_BAD_REQUEST,
                detail="O usuário já está ativo."
            )
        
        if user.role not in [UserRole.STUDENT, UserRole.TEACHER]:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_400_BAD_REQUEST,
                detail="Apenas estudantes ou professores podem ser ativados."
            )
        
        
        user.is_active = True
        
        db.commit()
        db.refresh(user)
        
        return user
    
def deactivate_user(user_id: str, current_user: 'User'):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem desativar usuários."
        )
    
    with get_db() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado."
            )
        
        if not user.is_active:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_400_BAD_REQUEST,
                detail="O usuário já está inativo."
            )
        
        if user.role not in [UserRole.STUDENT, UserRole.TEACHER]:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_400_BAD_REQUEST,
                detail="Apenas estudantes ou professores podem ser desativados."
            )
        
        
        user.is_active = False
        
        db.commit()
        db.refresh(user)
        
        return user

def update_user(user_id: str, user_in: UserUpdate, current_user: 'User') -> User:
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem atualizar usuários."
        )

    with get_db() as db:
        user_db = db.query(User).filter(User.id == user_id).first()

    if not user_db:
        raise fastapi.HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )

    update_data = user_in.model_dump(exclude_unset=True)

    # 3. Itera sobre os dados recebidos e atualiza o objeto do banco
    for key, value in update_data.items():
        setattr(user_db, key, value)

    # 4. Salva as mudanças no banco
    db.add(user_db)
    db.commit()
    db.refresh(user_db)
    
    return user_db


def get_inactive_users(current_user: 'User') -> list[UserPublic]:
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem acessar esta informação."
        )
    
    with get_db() as db:
        inactive_users = db.query(User).filter(
            User.is_active == False,
            User.role.in_([UserRole.STUDENT, UserRole.TEACHER])
        ).all()
        
        return inactive_users
    
def get_active_users(current_user: 'User', active: bool = True) -> list[UserPublic]:
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem acessar esta informação."
        )
    
    with get_db() as db:
        active_users = db.query(User).filter(
            User.is_active == active,
            User.role.in_([UserRole.STUDENT, UserRole.TEACHER])
        ).all()
        
        return active_users
    
def delete_user(user_id: str, current_user: 'User'):
    if current_user.role != UserRole.ADMIN:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem deletar usuários."
        )
    
    with get_db() as db:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado."
            )
        
        db.delete(user)
        db.commit()
        
        return None