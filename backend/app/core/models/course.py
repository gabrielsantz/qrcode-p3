import uuid
from typing import Optional
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime
from .table_registry import table_registry

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from . import Teacher, Enrollment, Attendance, CourseSchedule, ClassSession




@table_registry.mapped_as_dataclass(init=False)
class Course:
    __tablename__ = "courses"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[Optional[str]]

    teacher_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("teachers.id"))
    start_date: Mapped[datetime.date] = mapped_column(nullable=False, server_default=func.current_date())
    end_date: Mapped[datetime.date] = mapped_column(nullable=False)
    teacher: Mapped["Teacher"] = relationship(back_populates="courses")

    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="course_", cascade="all, delete-orphan")

    attendances: Mapped[list["Attendance"]] = relationship(back_populates="course_", cascade="all, delete-orphan")

    schedules: Mapped[list["CourseSchedule"]] = relationship(back_populates="course", cascade="all, delete-orphan")

    class_sessions: Mapped[list["ClassSession"]] = relationship(back_populates="course", cascade="all, delete-orphan")