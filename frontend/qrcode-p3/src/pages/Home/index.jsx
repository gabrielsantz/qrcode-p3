import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import CardOption from '../../components/CardOption';
import { BsFillPersonFill, BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Spinner } from 'react-bootstrap';

function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      let destination = '/';
      switch (user.role) {
        case 'student':
          destination = '/student';
          break;
        case 'teacher':
          destination = '/professor';
          break;
        case 'admin':
          destination = '/admin';
          break;
      }
      if (destination !== '/') {
        navigate(destination, { replace: true });
      }
    }
  }, [user, loading, navigate]);


    if (loading) {
      return (
        <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Carregando...</p>
        </div>
      );
    }


  return (
    <>
      <Header />
      <div className="text-center mt-5 px-4">
        <h1>Bem-vindo! 👋</h1>
        <p>Seja bem vindo ao PresençaQR, sistema desenvolvido pela UFAL para facilitar a marcação da presença nas aulas.</p>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row justify-content-center g-4">
          <CardOption
            icon={<BsFillPersonFill />}
            title="Faça login"
            text="Caso já tenha cadastro no sistema (professores ou alunos)"
            buttonLabel="Login"
            buttonVariant="primary"
            onClick={() => navigate("/login")}
          />
          <CardOption
            icon={<BsFillPersonPlusFill />}
            title="Registro"
            text="Faça o seu registro e espere a ativação da coordernação"
            buttonLabel="Registro"
            buttonVariant="secondary"
            onClick={() => navigate("/register")}
          />
        </div>
      </div>
    </>
  );
}

export default Home;