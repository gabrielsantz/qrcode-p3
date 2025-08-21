import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import CardOption from '../../components/CardOption';
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

          <CardOption
            icon={<BsFillPersonFill />}
            title="Faça login"
            text="Caso já tenha cadastro no sistema (professores ou alunos)"
            buttonLabel="Login"
            buttonVariant="primary"
          />

          <CardOption
            icon={<BsFillPersonPlusFill />}
            title="Registro"
            text="Faça o seu registro e espere a ativação da coordernação"
            buttonLabel="Registro"
            buttonVariant="secondary"
          />

        </div>
      </div>
    </>
  );
}

export default Home;
