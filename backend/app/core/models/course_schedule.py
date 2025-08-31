import uuid
from sqlalchemy import ForeignKey, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .table_registry import table_registry
import datetime
import enum

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .course import Course
    from .class_session import ClassSession

class DayOfWeek(enum.Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"

@table_registry.mapped_as_dataclass(init=False)
class CourseSchedule:
    __tablename__ = "course_schedules"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id"))
    day_of_week: Mapped[DayOfWeek] = mapped_column(nullable=False)
    start_time: Mapped[datetime.time] = mapped_column(Time, nullable=False) 
    end_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)    

    course: Mapped["Course"] = relationship(back_populates="schedules")
    class_sessions: Mapped[list["ClassSession"]] = relationship(back_populates="course_schedule")

