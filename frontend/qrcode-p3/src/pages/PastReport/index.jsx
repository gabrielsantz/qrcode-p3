import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

// dados mockados
const mockDatabase = {
  '1': { materia: 'Programação 3', alunos: [ { id: 1, nome: 'Ana Carolina', matricula: '22442313', chegada: '15:20' }, 
    { id: 2, nome: 'Bruno Costa', matricula: '432312343', chegada: '15:20' },
    { id: 3, nome: 'Carlos de Andrade', matricula: '12345678', chegada: '15:21' },
    { id: 4, nome: 'Daniela Ferreira', matricula: '56382892', chegada: '15:21' },
    { id: 5, nome: 'Eduardo Martins', matricula: '62801846', chegada: '15:22' },
    { id: 6, nome: 'Fernanda Gonçalves', matricula: '62820512', chegada: '15:22' },
    { id: 7, nome: 'Gabriel Lima', matricula: '97251846', chegada: '15:25' },
    { id: 8, nome: 'Helena Oliveira', matricula: '62583512', chegada: '15:26' },
    { id: 9, nome: 'Igor Pereira', matricula: '21456254', chegada: '15:26' }, ] },
  '2': { materia: 'Programação 1', alunos: [ { id: 1, nome: 'Ana Carolina', matricula: '22442313', chegada: '15:20' }, 
    { id: 2, nome: 'Bruno Costa', matricula: '432312343', chegada: '15:20' },
    { id: 3, nome: 'Carlos de Andrade', matricula: '12345678', chegada: '15:21' },
    { id: 4, nome: 'Daniela Ferreira', matricula: '56382892', chegada: '15:21' },
    { id: 5, nome: 'Eduardo Martins', matricula: '62801846', chegada: '15:22' },
    { id: 6, nome: 'Fernanda Gonçalves', matricula: '62820512', chegada: '15:22' },
    { id: 7, nome: 'Gabriel Lima', matricula: '97251846', chegada: '15:25' },
    { id: 8, nome: 'Helena Oliveira', matricula: '62583512', chegada: '15:26' },
    { id: 9, nome: 'Igor Pereira', matricula: '21456254', chegada: '15:26' }, ] },
  '3': { materia: 'Teoria da Computação', alunos: [ { id: 1, nome: 'Ana Carolina', matricula: '22442313', chegada: '15:20' }, 
    { id: 2, nome: 'Bruno Costa', matricula: '432312343', chegada: '15:20' },
    { id: 3, nome: 'Carlos de Andrade', matricula: '12345678', chegada: '15:21' },
    { id: 4, nome: 'Daniela Ferreira', matricula: '56382892', chegada: '15:21' },
    { id: 5, nome: 'Eduardo Martins', matricula: '62801846', chegada: '15:22' },
    { id: 6, nome: 'Fernanda Gonçalves', matricula: '62820512', chegada: '15:22' },
    { id: 7, nome: 'Gabriel Lima', matricula: '97251846', chegada: '15:25' },
    { id: 8, nome: 'Helena Oliveira', matricula: '62583512', chegada: '15:26' },
    { id: 9, nome: 'Igor Pereira', matricula: '21456254', chegada: '15:26' }, ] },
};

const PastReportsPage = () => {
  const { reportId } = useParams();
  const [materia, setMateria] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //simula um tempo de espera 
    setTimeout(() => {
      const reportData = mockDatabase[reportId];
      
      if (reportData) {
        setMateria(reportData.materia);
        setAlunos(reportData.alunos);
      } else {
        setError('Relatório não encontrado');
      }
      setLoading(false);
    }, 500);
  }, [reportId]);

  const handleSaveAsPDF = () => {
    console.log('Gerando PDF...');
    alert('Função de gerar PDF a ser implementada!');
  };

  if (loading) {
    return <div className="loading"><h1>Carregando lista de presença...</h1></div>;
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
          <button onClick={handleSaveAsPDF} className="btn-custom btn-save-pdf">
            Salvar como PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default PastReportsPage;
