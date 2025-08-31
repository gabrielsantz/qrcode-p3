import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './reportGeneration.css';

// dados mockados
const mockData = {
  materia: 'Programação 3',
  alunos: [
    { id: 1, nome: 'Ana Carolina', matricula: '22442313', chegada: '15:20' },
    { id: 2, nome: 'Bruno Costa', matricula: '432312343', chegada: '15:20' },
    { id: 3, nome: 'Carlos de Andrade', matricula: '12345678', chegada: '15:21' },
    { id: 4, nome: 'Daniela Ferreira', matricula: '56382892', chegada: '15:21' },
    { id: 5, nome: 'Eduardo Martins', matricula: '62801846', chegada: '15:22' },
    { id: 6, nome: 'Fernanda Gonçalves', matricula: '62820512', chegada: '15:22' },
    { id: 7, nome: 'Gabriel Lima', matricula: '97251846', chegada: '15:25' },
    { id: 8, nome: 'Helena Oliveira', matricula: '62583512', chegada: '15:26' },
    { id: 9, nome: 'Igor Pereira', matricula: '21456254', chegada: '15:26' },
  ]
};

const AttendanceListPage = () => {
  const [materia, setMateria] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //simula um tempo de espera 
    setTimeout(() => {
      setMateria(mockData.materia);
      setAlunos(mockData.alunos);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveToSystem = () => {
    console.log('Salvando no sistema...', alunos);
    alert('Dados salvos no sistema com sucesso!');
  };

  const handleSaveAsPDF = () => {
    console.log('Gerando PDF...');
    alert('Função de gerar PDF a ser implementada!');
  };

  if (loading) {
    return <div class = "loading"><h1>Carregando lista de presença...</h1></div>;
  }

  return (
    <>
      <div className="header-container">
        <Header />
      </div>

      <div className="attendance-list-container">
        <div className="materia-header">
          <label htmlFor="materia-display">Matéria:</label>
          <div id="materia-display" className="materia-display-box">
            {materia}
          </div>
        </div>

        <table className="table table-bordered presence-list-table table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Chegada</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{aluno.matricula}</td>
                <td>{aluno.chegada}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="action-buttons">
          <button onClick={handleSaveToSystem} className="btn-custom btn-save-system">
            Salvar no sistema
          </button>
          <button onClick={handleSaveAsPDF} className="btn-custom btn-save-pdf">
            Salvar como PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default AttendanceListPage;
