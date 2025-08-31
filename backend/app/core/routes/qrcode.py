from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.models import User
from app.core.security import get_current_user
from app.core.schemas.qrcode import QRTokenRequest, QRTokenResponse, QRScanRequest, QRScanResponse
from app.core.services.qrcode import generate_qr_token, scan_qr_code

router = APIRouter(prefix="/qrcode", tags=["QR Code"])


@router.post("/generate-token", response_model=QRTokenResponse)
## TODO: Refatorar para usar o class_session
def generate_qr_token_route(
    request: QRTokenRequest,
    current_user: User = Depends(get_current_user)
):    
    return generate_qr_token(request, current_user)


@router.post("/scan", response_model=QRScanResponse)
def scan_qr_code_route(
    scan_data: QRScanRequest,
    current_user: User = Depends(get_current_user)
):
    return scan_qr_code(scan_data, current_user)