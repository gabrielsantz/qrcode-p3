import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .table_registry import table_registry
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .course import Course
    from .course_schedule import CourseSchedule
    from .attendance import Attendance

@table_registry.mapped_as_dataclass(init=False)
class ClassSession:
    __tablename__ = "class_sessions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"))
    course_schedule_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("course_schedules.id"), nullable=True)
    
    date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    start_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    end_time: Mapped[Optional[datetime.time]] = mapped_column(Time, nullable=True)
    
    title: Mapped[Optional[str]] = mapped_column(nullable=True)
    description: Mapped[Optional[str]] = mapped_column(nullable=True)
    
    course: Mapped["Course"] = relationship()
    course_schedule: Mapped[Optional["CourseSchedule"]] = relationship(back_populates="class_sessions")
    attendances: Mapped[list["Attendance"]] = relationship(back_populates="class_session")
