from sqlalchemy import func, text
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from .table_registry import table_registry
import uuid
from datetime import datetime
import enum

class UserRole(enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"
    TEACHER = "teacher"

@table_registry.mapped_as_dataclass(init=False)
class User:
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    registration: Mapped[Optional[str]] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(nullable=False)

    is_active: Mapped[bool] = mapped_column(nullable=False, server_default=text("false"))
    
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    def __init__(self, name:str, email: str, hashed_password: str, role: UserRole, registration: str | None = None):
        if not name:
            raise ValueError("O nome é obrigatório.")
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        if not hashed_password:
            raise ValueError("A senha é obrigatória.")
        if not role:
            raise ValueError("A role é obrigatória.")

        if role == UserRole.STUDENT and not registration:
            raise ValueError("A matrícula é obrigatória para alunos.")
        
        if role != UserRole.STUDENT and registration is not None:
            raise ValueError("A matrícula só é permitida para alunos.")

        self.name = name
        self.registration = registration
        self.email = email
        self.hashed_password = hashed_password
        self.role = role

