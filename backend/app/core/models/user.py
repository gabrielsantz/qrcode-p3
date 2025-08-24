from sqlalchemy import func, text
from sqlalchemy.orm import Mapped, mapped_column
from .table_registry import table_registry
from app.core.security import hash_password
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
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[UserRole] = mapped_column(nullable=False)

    is_active: Mapped[bool] = mapped_column(nullable=False, server_default=text("false"))
    
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    def __init__(self, email: str, password: str, role: UserRole):
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        if not password:
            raise ValueError("A senha é obrigatória.")
        if not role:
            raise ValueError("A role é obrigatória.")
        
        hashed_password = hash_password(password)

        self.email = email
        self.hashed_password = hashed_password
        self.role = role