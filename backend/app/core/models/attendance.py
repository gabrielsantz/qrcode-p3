import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .table_registry import table_registry
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .course import Course
    from .student import Student

@table_registry.mapped_as_dataclass(init=False)
class Attendance:
    __tablename__ = "attendances"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"))
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"))
    date: Mapped[datetime] = mapped_column(server_default=func.now())
    present: Mapped[bool] = mapped_column(nullable=False, server_default=text("false"))

    student: Mapped["Student"] = relationship()
    course_: Mapped["Course"] = relationship(back_populates="attendances")