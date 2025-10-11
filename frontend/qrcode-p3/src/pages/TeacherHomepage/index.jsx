import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import CardOption from '../../components/CardOption';
import { BsQrCode } from "react-icons/bs";
import { BsClockHistory } from "react-icons/bs";
import { useAuth } from "../../AuthContext";
import { useNavigate } from 'react-router-dom';

function TeacherHomepage() {
  const {user} = useAuth()
  const navigate = useNavigate();
  

  return (
    <>
      <Header />
      <div className="text-center mt-5 px-4">
        <h1>Bem-vindo, professor! 👋</h1>
        <p>O que deseja fazer?</p>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center g-4">

            <CardOption
                icon={<BsQrCode />}
                title="Gerar QR Code"
                text="Gerar o QR Code da aula"
                buttonLabel="Gerar"
                buttonVariant="primary"
                onClick={() => navigate("/professor/classes")}
            />

            <CardOption
                icon={<BsClockHistory />}
                title="Verificar relatórios de presença"
                text="Verifique as presenças de aulas passadas ministradas por você"
                buttonLabel="Verificar"
                buttonVariant="secondary"
                onClick={() => navigate("/professor/reports")}
            />

        </div>
      </div>
    </>
  );
}

export default TeacherHomepage;
