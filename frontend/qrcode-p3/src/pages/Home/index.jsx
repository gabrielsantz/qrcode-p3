import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillPersonPlusFill } from "react-icons/bs";

function Home() {
  return (
    <>
      <Header />
      <div className="text-center mt-5 px-4">
        <h1>Bem-vindo! 👋</h1>
        <p>Seja bem vindo ao PresençaQR, sistema desenvolvido pela UFAL para facilitar a marcação da presença nas aulas.</p>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center g-4">
          
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card text-center p-4 h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <div className="card-icon mb-3">
                  <div className="rounded-circle p-3 bg-light d-inline-flex justify-content-center align-items-center">
                    <BsFillPersonFill size={40} />
                  </div>
                </div>
                <h5 className="card-title fw-bold">Faça login</h5>
                <p className="card-text">Caso já tenha cadastro no sistema (professores ou alunos)</p>
                <div className="mt-auto">
                  <button className="btn btn-outline-primary mt-3">Login</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-5">
            <div className="card text-center p-4 h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <div className="card-icon mb-3">
                  <div className="rounded-circle p-3 bg-light d-inline-flex justify-content-center align-items-center">
                    <BsFillPersonPlusFill size={40}/>
                  </div>
                </div>
                <h5 className="card-title fw-bold">Registro</h5>
                <p className="card-text">Faça o seu registro e espere a ativação da coordernação</p>
                <div className="mt-auto">
                  <button className="btn btn-outline-secondary mt-3">Registro</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Home;
