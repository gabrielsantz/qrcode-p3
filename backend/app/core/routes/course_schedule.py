import uuid
from fastapi import APIRouter, status

from app.core.schemas.course_schedule import CourseScheduleCreate, CourseScheduleRead
from app.core.services import course_schedules as schedule_service

router = APIRouter()

@router.post("/courses/{course_id}/schedules", response_model=CourseScheduleRead, status_code=status.HTTP_201_CREATED, tags=["Horários"])
def add_schedule_to_course(course_id: uuid.UUID, schedule_in: CourseScheduleCreate):
    return schedule_service.create_schedule_for_course(course_id=course_id, schedule_in=schedule_in)

@router.get("/courses/{course_id}/schedules", response_model=list[CourseScheduleRead], tags=["Horários"])
def read_schedules_for_course(course_id: uuid.UUID):
    return schedule_service.get_schedules_for_course(course_id=course_id)

@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Horários"])
def remove_schedule(schedule_id: uuid.UUID):
    schedule_service.delete_schedule(schedule_id=schedule_id)
    return