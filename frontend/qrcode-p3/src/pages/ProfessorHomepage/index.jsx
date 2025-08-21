import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import { BsQrCode } from "react-icons/bs";
import { BsClockHistory } from "react-icons/bs";

function ProfessorHomepage() {
  return (
    <>
      <Header />
      <div className="text-center mt-5 px-4">
        <h1>Bem-vindo, nome do professor! 👋</h1>
        <p>O que deseja fazer?</p>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center g-4">
          
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card text-center p-4 h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <div className="card-icon mb-3">
                  <div className="rounded-circle p-3 bg-light d-inline-flex justify-content-center align-items-center">
                    <BsQrCode size={40} />
                  </div>
                </div>
                <h5 className="card-title fw-bold">Gerar QR Code</h5>
                <p className="card-text">Gerar o QR Code da aula</p>
                <div className="mt-auto">
                  <button className="btn btn-outline-primary mt-3">Gerar</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-5">
            <div className="card text-center p-4 h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <div className="card-icon mb-3">
                  <div className="rounded-circle p-3 bg-light d-inline-flex justify-content-center align-items-center">
                    <BsClockHistory size={40}/>
                  </div>
                </div>
                <h5 className="card-title fw-bold">Verificar relatórios de presença</h5>
                <p className="card-text">Verifique as presenças de aulas passadas ministradas por você</p>
                <div className="mt-auto">
                  <button className="btn btn-outline-secondary mt-3">Verificar</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ProfessorHomepage;