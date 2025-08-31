import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Header from "../../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function QrGenerator() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(60);
    const [qrValue, setQrValue] = useState(`QR-${Date.now()}`);
    const qrCodeSize = 500;

    useEffect(() => {
        if (timeLeft === 0) {
            generateNewQr();
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const generateNewQr = () => {
        setQrValue(`QR-${Date.now()}`);
        setTimeLeft(60);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="d-flex flex-column vh-100 bg-light">
            <Header />

            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                
                <h4 className="mb-2">{formatTime(timeLeft)}</h4>

                <div className="progress mb-4" style={{ height: "20px", width: `${qrCodeSize + 30}px` }}>
                    <div
                        className="progress-bar progress-bar-striped bg-success"
                        role="progressbar"
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                        aria-valuenow={timeLeft}
                        aria-valuemin="0"
                        aria-valuemax="60"
                    >
                    </div>
                </div>

                <div className="bg-white p-3 rounded shadow">
                    <QRCodeSVG value={qrValue} size={qrCodeSize} />
                </div>
                
                <button 
                    className="btn btn-outline-dark mt-4" 
                    style={{ width: `${qrCodeSize + 30}px` }}
                    onClick={() => navigate('/professor/qr-code/report-generation')}
                >
                    Encerrar aula e gerar relatório
                </button>

            </div>
        </div>
    );
}

export default QrGenerator;
