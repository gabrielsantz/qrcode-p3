import 'bootstrap/dist/css/bootstrap.min.css';
import { Scanner } from '@yudiel/react-qr-scanner';
import Header from '../../components/Header';
import './style.css'

function QrReaderPage() {
  return (
    <>
      <div className="header-container">
        <Header />
      </div>

      <div className="scanner-container">
        <Scanner
          onScan={(result) => console.log(result)}
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
