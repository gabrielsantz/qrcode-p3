import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import CardOption from '../../components/CardOption';
import { BsQrCodeScan } from "react-icons/bs";
import { BsClockHistory } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";


function StudentHomepage() {
  const navigate = useNavigate();
  const {user} = useAuth()

  
  return (
    <>
      <Header />
      <div className="text-center mt-5 px-4">
        <h1>Bem-vindo, {user?.name ?? "Aluno"} 👋</h1>
        <p>O que deseja fazer?</p>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center g-4">
          
          <CardOption 
            icon={<BsQrCodeScan />}
            title="Ler QR Code"
            text="Marque sua presença na aula"
            buttonLabel="Ler"
            buttonVariant="primary"
            onClick={() => navigate("/student/qr-reader")}
          />

          <CardOption 
            icon={<BsClockHistory />}
            title="Ver histórico de presença"
            text="Verifique suas últimas presenças nas aulas"
            buttonLabel="Ver"
            buttonVariant="secondary"
          />

        </div>
      </div>
    </>
  );
}

export default StudentHomepage;
