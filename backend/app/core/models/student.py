import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .table_registry import table_registry
from .user import User

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .enrollment import Enrollment
    from .attendance import Attendance


@table_registry.mapped_as_dataclass(init=False)
class Student:
    __tablename__ = "students"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), unique=True)

    user: Mapped[User] = relationship(back_populates="student")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    attendances: Mapped[list["Attendance"]] = relationship(
        cascade="all, delete-orphan", back_populates="student"
    )