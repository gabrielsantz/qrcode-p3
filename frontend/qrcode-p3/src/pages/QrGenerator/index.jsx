import React, { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import Header from "../../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api";
import { Spinner, Alert } from 'react-bootstrap';

function QrGenerator() {
    const navigate = useNavigate();
    const { classSessionId } = useParams();

    const [timeLeft, setTimeLeft] = useState(60);
    const [qrValue, setQrValue] = useState("");
    const [status, setStatus] = useState('getting_location');
    const [error, setError] = useState(null);

    const qrCodeSize = 500;

    const fetchQrToken = useCallback(async (latitude, longitude) => {
        setStatus('loading');
        setError(null);
        try {
            const response = await apiClient.post('/qrcode/generate-token', {
                class_session_id: classSessionId
            });

            if (response.data && response.data.token) {
                setQrValue(response.data.token);
                setTimeLeft(60);
                setStatus('ready');
            } else {
                throw new Error("Resposta da API inválida.");
            }
        } catch (err) {
            console.error("Erro ao gerar QR Code:", err);
            setError("Não foi possível gerar um novo QR Code. Tente novamente.");
            setStatus('error');
        }
    }, [classSessionId]);


    useEffect(() => {
        if (status !== 'ready') return;

        if (timeLeft === 0) {
            fetchQrToken();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, status]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderQrCode = () => {
        switch (status) {
            case 'loading':
                return <div className="d-flex flex-column justify-content-center align-items-center p-5" style={{ width: qrCodeSize, height: qrCodeSize }}><Spinner animation="border" /><p className="mt-3">Gerando QR Code...</p></div>;
            case 'error':
                return <Alert variant="danger" className="m-3" style={{ width: qrCodeSize }}>{error}</Alert>;
            case 'ready':
                return <QRCodeSVG value={qrValue} size={qrCodeSize} />;
            default:
                return null;
        }
    };

    return (
        <div className="d-flex flex-column vh-100 bg-light">
            <Header />
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                {status === 'ready' && (
                    <>
                        <h4 className="mb-2">{formatTime(timeLeft)}</h4>
                        <div className="progress mb-4" style={{ height: "20px", width: `${qrCodeSize + 30}px` }}>
                            <div
                                className="progress-bar progress-bar-striped bg-success progress-bar-animated"
                                role="progressbar"
                                style={{ width: `${(timeLeft / 60) * 100}%` }}
                            ></div>
                        </div>
                    </>
                )}
                <div className="bg-white p-3 rounded shadow">
                    {renderQrCode()}
                </div>
                <button
                    className="btn btn-outline-dark mt-4"
                    style={{ width: `${qrCodeSize + 30}px` }}
                    onClick={() => navigate(`/professor/qr-code/report-generation/${classSessionId}`)}
                >
                    Encerrar aula e gerar relatório
                </button>
            </div>
        </div>
    );
}

export default QrGenerator;
