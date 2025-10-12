import fastapi

from app.core.models import User
from app.core.security import get_current_user
from app.api.qrcode.schemas import QRTokenRequest, QRTokenResponse, QRScanRequest, QRScanResponse
from app.api.qrcode.services import generate_qr_token, scan_qr_code

router = fastapi.APIRouter(prefix="/qrcode", tags=["QR Code"])


@router.post("/generate-token", response_model=QRTokenResponse)
def generate_qr_token_route(
    request: QRTokenRequest,
    current_user: User = fastapi.Depends(get_current_user)
):    
    return generate_qr_token(request, current_user)


@router.post("/scan", response_model=QRScanResponse)
def scan_qr_code_route(
    scan_data: QRScanRequest,
    current_user: User = fastapi.Depends(get_current_user)
):
    return scan_qr_code(scan_data, current_user)