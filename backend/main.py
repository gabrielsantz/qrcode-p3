from fastapi import FastAPI, APIRouter
from app.core.routes.auth import router as authn_router


api_router = APIRouter()
api_router.include_router(authn_router, prefix="/auth", tags=["Autenticação"])

app = FastAPI(title="PresençaQR - UFAL")
app.include_router(api_router, prefix="/api") 