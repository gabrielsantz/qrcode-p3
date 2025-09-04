import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import './checkReportData.css';

// dados mockados
const mockReportDatabase = {
  '1': {
    materia: 'Programação 3',
    professor: 'Ranilson Paiva',
    statistics: {
      presentStudents: '34 x 23',
      subtitle: 'Primeira aula x Aula atual',
      presencePercentage: '63%',
      averageArrivalTime: '15:26',
    },
    alunos: [
      { id: 1, nome: 'Ana Carolina', matricula: '22442313', chegada: '15:20' },
      { id: 2, nome: 'Bruno Costa', matricula: '432312343', chegada: '15:20' },
      { id: 3, nome: 'Carlos de Andrade', matricula: '12345678', chegada: '15:21' },
    ],
  },
  '2': {
    materia: 'Programação 2',
    professor: 'Mario Hozano',
    statistics: {
      presentStudents: '30 x 25',
      subtitle: 'Primeira aula x Aula atual',
      presencePercentage: '83%',
      averageArrivalTime: '13:35',
    },
    alunos: [
      { id: 1, nome: 'Ana Carolina', matricula: '22442313', chegada: '13:31' },
      { id: 2, nome: 'Bruno Costa', matricula: '432312343', chegada: '13:32' },
      { id: 3, nome: 'Carlos de Andrade', matricula: '12345678', chegada: '13:32' },
    ],
  }
  // ... outros relatórios
};

// sub-componente para os cards de estatística
const StatCard = ({ title, value, subtitle }) => (
  <div className="stat-card">
    <span className="stat-title">{title}</span>
    <span className="stat-value">{value}</span>
    {subtitle && <span className="stat-subtitle">{subtitle}</span>}
  </div>
);

const CheckDataPage = () => {
  const { reportId } = useParams(); // pega o ID da URL
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simula a busca de dados para o relatório específico
    setTimeout(() => {
      const data = mockReportDatabase[reportId];
      if (data) {
        setReportData(data);
      }
      setLoading(false);
    }, 1000);
  }, [reportId]);

  const handleSavePDF = () => {
    alert('Implementar a função de salvar como PDF!');
  };

  if (loading) {
    return <div className="loading"><h1>Carregando relatório...</h1></div>;
  }

  if (!reportData) {
    return <div className="loading"><h1>Relatório não encontrado.</h1></div>;
  }

  const { materia, professor, statistics, alunos } = reportData;

  return (
    <>
      <Header />
      <div className="report-stats-container">
        <div className="report-header">
          <span className="report-materia">{materia}</span>
          <span className="report-professor">Prof. {professor}</span>
        </div>

        <div className="stats-grid">
          <StatCard 
            title="Quantidade de alunos presentes" 
            value={statistics.presentStudents}
            subtitle={statistics.subtitle}
          />
          <StatCard 
            title="Porcentagem de presença" 
            value={statistics.presencePercentage}
          />
          <StatCard 
            title="Horário médio de chegada" 
            value={statistics.averageArrivalTime}
          />
        </div>

        <table className="table table-striped report-table">
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

        <div className="pdf-button-container">
          <button onClick={handleSavePDF} className="btn-save-pdf-main">
            Salvar como PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckDataPage;