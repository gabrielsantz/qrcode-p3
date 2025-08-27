import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .table_registry import table_registry
from .user import User

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .course import Course


@table_registry.mapped_as_dataclass(init=False)
class Teacher:
    __tablename__ = "teachers"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), unique=True)

    user: Mapped[User] = relationship(back_populates="teacher")

    courses: Mapped[list["Course"]] = relationship(back_populates="teacher")