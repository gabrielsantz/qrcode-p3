import { useEffect, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import Header from "../../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api";

function QrGenerator() {
    const navigate = useNavigate();
    const { classSessionId } = useParams(); 

    const [timeLeft, setTimeLeft] = useState(60);
    const [qrValue, setQrValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const qrCodeSize = 500;

    const fetchQrToken = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/qrcode/generate-token', { 
                class_session_id: classSessionId
            });

            if (response.data && response.data.token) {
                setQrValue(response.data.token);
                setTimeLeft(60);
            } else {
                throw new Error("Resposta da API inválida.");
            }
        } catch (err) {
            console.error("Erro ao gerar QR Code:", err);
            setError("Não foi possível gerar um novo QR Code. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [classSessionId]);

    useEffect(() => {
        fetchQrToken();
    }, [fetchQrToken]);

    useEffect(() => {
        if (timeLeft === 0) {
            fetchQrToken();
        }
        
        if (isLoading) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isLoading, fetchQrToken]);


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    const renderQrCode = () => {
        if (isLoading) {
            return <div style={{ width: qrCodeSize, height: qrCodeSize }} className="d-flex justify-content-center align-items-center">Carregando QR Code...</div>;
        }
        if (error) {
            return <div style={{ width: qrCodeSize, height: qrCodeSize, textAlign: 'center' }} className="d-flex justify-content-center align-items-center alert alert-danger">{error}</div>;
        }
        if(qrValue){
            return <QRCodeSVG value={qrValue} size={qrCodeSize} />;
        }
        return null;
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
                    >
                    </div>
                </div>

                <div className="bg-white p-3 rounded shadow">
                    {renderQrCode()}
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