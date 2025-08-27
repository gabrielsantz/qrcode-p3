import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .table_registry import table_registry

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .student import Student
    from .course import Course


@table_registry.mapped_as_dataclass(init=False)
class Enrollment:
    __tablename__ = "enrollments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"))
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"))
    enrolled_at: Mapped[datetime] = mapped_column(server_default=func.now())

    student: Mapped["Student"] = relationship(back_populates="enrollments")
    course_: Mapped["Course"] = relationship(back_populates="enrollments")