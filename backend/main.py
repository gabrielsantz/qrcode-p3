from fastapi import FastAPI, APIRouter
from app.core.routes.auth import router as authn_router
from fastapi.middleware.cors import CORSMiddleware

api_router = APIRouter()
api_router.include_router(authn_router, prefix="/auth", tags=["Autenticação"])

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
app.include_router(api_router, prefix="/api") 
