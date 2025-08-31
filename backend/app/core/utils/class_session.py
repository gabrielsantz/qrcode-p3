from app.core.models.course_schedule import DayOfWeek

def to_day_of_week(int_day: int) -> DayOfWeek:
    if(int_day == 0):
        return DayOfWeek.MONDAY
    elif(int_day == 1): 
        return DayOfWeek.TUESDAY
    elif(int_day == 2):
        return DayOfWeek.WEDNESDAY
    elif(int_day == 3):
        return DayOfWeek.THURSDAY
    elif(int_day == 4):
        return DayOfWeek.FRIDAY
    elif(int_day == 5):
        return DayOfWeek.SATURDAY
    elif(int_day == 6):
        return DayOfWeek.SUNDAY
    else:
        raise ValueError("Invalid day of week integer")