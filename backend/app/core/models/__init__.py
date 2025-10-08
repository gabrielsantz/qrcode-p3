from .user import User, UserRole
from .student import Student
from .teacher import Teacher
from .course import Course
from .course_schedule import CourseSchedule
from .class_session import ClassSession
from .enrollment import Enrollment
from .attendance import Attendance
from .table_registry import table_registry

__all__ = [
    "User", "UserRole", "Student", "Teacher", "Course", 
    "CourseSchedule", "ClassSession", "Enrollment", "Attendance", "table_registry"
]