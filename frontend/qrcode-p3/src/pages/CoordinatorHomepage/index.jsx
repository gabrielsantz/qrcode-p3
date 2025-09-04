import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import CardOption from '../../components/CardOption';
import { BsBarChart } from "react-icons/bs";
import { BsPersonAdd } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../AuthContext";


function CoordinatorHomepage() {
  const navigate = useNavigate();
//   const {user} = useAuth()

  
  return (
    <>
      <Header />
      <div className="text-center mt-5 px-4">
        {/* <h1>Bem-vindo, {user?.name ?? "Coordenador"} 👋</h1>  PARA QUANDO IMPLEMENTAR A ROLE*/}
        <h1>Bem-vindo, Coordenador 👋</h1>
        <p>O que deseja fazer?</p>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center g-4">
          
          <CardOption 
            icon={<BsBarChart />}
            title="Verificar dados"
            text="Verifique as dados de aulas passadas do IC"
            buttonLabel="Verificar"
            buttonVariant="primary"
            // onClick={() => navigate("/student/qr-reader")}
          />

          <CardOption 
            icon={<BsPersonAdd />}
            title="Analisar perfis"
            text="Verifique e aprove perfis para utilizar o Sistema de Presença"
            buttonLabel="Analisar"
            buttonVariant="secondary"
            onClick={() => navigate("/coordinator/user-management")}
          />

        </div>
      </div>
    </>
  );
}

export default CoordinatorHomepage;
