from sqlalchemy import func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from .table_registry import table_registry
import uuid
from datetime import datetime
import enum

from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .student import Student
    from .teacher import Teacher


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
    
    student: Mapped[Optional["Student"]] = relationship(
        back_populates="user",
        lazy="joined",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    teacher: Mapped[Optional["Teacher"]] = relationship(
        back_populates="user",
        lazy="joined",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    
    @property
    def student_id(self) -> Optional[uuid.UUID]:
        return self.student.id if self.student else None
    
    @property
    def teacher_id(self) -> Optional[uuid.UUID]:
        return self.teacher.id if self.teacher else None