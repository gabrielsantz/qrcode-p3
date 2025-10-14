import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .table_registry import table_registry
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.core.models import Student, Course, ClassSession, Enrollment


@table_registry.mapped_as_dataclass(init=False)
class Attendance:
    __tablename__ = "attendances"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"))
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"))
    class_session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("class_sessions.id"))
    enrollment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("enrollments.id"))

    present: Mapped[bool] = mapped_column(nullable=False, server_default=text("true"))
    marked_at: Mapped[datetime] = mapped_column(init=False, nullable=True)
    

    student: Mapped["Student"] = relationship(back_populates="attendances")
    course_: Mapped["Course"] = relationship()
    class_session: Mapped["ClassSession"] = relationship(back_populates="attendances")
    enrollment: Mapped["Enrollment"] = relationship(back_populates="attendances")