from fastapi import FastAPI, APIRouter
from app.api.auth.controller import router as authn_router
from app.api.course.controller import router as courses_router
from app.api.enrollment.controller import router as enrollments_router
from app.api.qrcode.controller import router as qrcode_router
from app.api.class_session.controller import router as class_session_router
from app.api.student.controller import router as student_router
from app.api.attendance.controller import router as attendance_router
from app.api.users.controller import router as users_router
from fastapi.middleware.cors import CORSMiddleware

api_router = APIRouter(prefix="/api")
api_router.include_router(authn_router)
api_router.include_router(courses_router)
api_router.include_router(enrollments_router)
api_router.include_router(qrcode_router)
api_router.include_router(class_session_router)
api_router.include_router(student_router)
api_router.include_router(attendance_router)
api_router.include_router(users_router)

app = FastAPI(title="PresençaQR - UFAL")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/v1") 
