import React, { useState, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import Header from '../../components/Header';
import './style.css';
import apiClient from '../../api';
import { Spinner } from 'react-bootstrap';

import ScanSuccess from '../../components/ScanFeedback/ScanSuccess';
import ScanError from '../../components/ScanFeedback/ScanError';

function QrReaderPage() {
  const [scanState, setScanState] = useState('scanning');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleScanResult = useCallback(async (scannedToken) => {
    if (!scannedToken || scanState !== 'scanning') return;

    setScanState('getting_location');

    if (!navigator.geolocation) {
      setFeedbackMessage("Geolocalização não é suportada neste navegador.");
      setScanState('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setScanState('loading');
        try {
          const response = await apiClient.post('/qrcode/scan', {
            token: scannedToken,
            latitude,
            longitude,
          });
          setFeedbackMessage(response.data.detail || 'Presença confirmada!');
          setScanState('success');
        } catch (error) {
          setFeedbackMessage(error.response?.data?.detail || 'QR Code inválido ou expirado.');
          setScanState('error');
        }
      },
      (geoError) => {
        setFeedbackMessage('Não foi possível obter sua localização. Ative o GPS e permita o acesso.');
        setScanState('error');
      }
    );
  }, [scanState]);

  const handleRetry = () => {
    setScanState('scanning');
    setFeedbackMessage('');
  };

  const renderContent = () => {
    switch (scanState) {
      case 'getting_location':
      case 'loading':
        return (
          <div className="text-center text-white">
            <Spinner animation="border" role="status" variant="light" />
            <p className="lead mt-3">
              {scanState === 'getting_location' ? 'Obtendo sua localização...' : 'Validando presença...'}
            </p>
          </div>
        );
      case 'success':
        return <ScanSuccess message={feedbackMessage} />;
      case 'error':
        return <ScanError message={feedbackMessage} onRetry={handleRetry} />;
      case 'scanning':
      default:
        return (
          <>
            <Scanner
              onScan={(result) => handleScanResult(result[0].rawValue)}
              components={{ finder: false }}
            />
            <div className="overlay">
              <div className="mask"><div className="frame"></div></div>
              <div className="instructions text-white text-center">
                <h1 className="display-6">Ler QR Code</h1>
                <p className="lead">Centralize o código na moldura.</p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="scanner-container">
        {renderContent()}
      </div>
    </>
  );
}

export default QrReaderPage;