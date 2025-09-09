import 'bootstrap/dist/css/bootstrap.min.css';
import { Scanner } from '@yudiel/react-qr-scanner';
import Header from '../../components/Header';
import './style.css';
import apiClient from '../../api';
import { useCallback } from 'react'; // Import useCallback

function QrReaderPage() {

  const sendQrCodeData = useCallback(async (scannedToken) => {
    if (!scannedToken) return; 

    try { 
      const response = await apiClient.post('/qrcode/scan', { token: scannedToken });


      if (response.status !== 200) {
        throw new Error(`Failed to send QR code data. Status: ${response.status}`);
      }

      const result = response.data; 
      console.log('QR code data sent successfully:', result);
      alert(`Success: ${result.message}`);

    } catch (error) {
      console.error('Error sending QR code data:', error);

      const errorMessage = error.response?.data?.detail || error.message;
      alert(`Error: ${errorMessage}`);
    }
  }, []); 

  return (
    <>
      <div className="header-container">
        <Header />
      </div>

      <div className="scanner-container">
        <Scanner
          onScan={(result) => sendQrCodeData(result[0].rawValue)}
          components={{ finder: false }}
        />

        <div className="overlay">
          <div className="mask">
            <div className="frame"></div>
          </div>
          <div className="instructions text-white text-center">
            <h1 className="display-6">Ler QR Code</h1>
            <p className="lead">Centralize o código na moldura.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default QrReaderPage;