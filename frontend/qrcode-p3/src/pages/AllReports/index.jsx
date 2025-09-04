import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './allReports.css';

// dados mockados
const mockReportsData = [
  { id: 1, materia: 'Programação 3', data: '21/08/2025', professor: 'Ranilson Paiva' },
  { id: 2, materia: 'Programação 2', data: '21/08/2025', professor: 'Mario Hozano' },
  { id: 3, materia: 'Redes de Computadores', data: '21/08/2025', professor: 'Almir' },
  { id: 4, materia: 'Aprendizagem de Máquina', data: '20/08/2025', professor: 'Aydano' },
  { id: 5, materia: 'Teoria dos Grafos', data: '20/08/2025', professor: 'Rian' },
];

const AllReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // ordena os dados por data para demonstração
      const sortedData = mockReportsData.sort((a, b) => new Date(b.data.split('/').reverse().join('-')) - new Date(a.data.split('/').reverse().join('-')));
      setReports(sortedData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="loading"><h1>Carregando relatórios...</h1></div>;
  }

  let lastDate = null;

  return (
    <>
      <Header />
      <div className="professor-reports-container">
        {reports.map(report => {
          const showDateHeader = report.data !== lastDate;
          lastDate = report.data;

          return (
            <React.Fragment key={report.id}>
              {showDateHeader && (
                <div className="report-date-group">
                  <h2 className="report-date-header">Dia {report.data}:</h2>
                </div>
              )}
              
              <button
                className="report-card"
                onClick={() => navigate(`/admin/all-reports/check-data/${report.id}`)}
              >
                <div className="report-info">
                  <span className="report-subject-name">{report.materia}</span>
                  <span className="report-professor-name">Prof. {report.professor}</span>
                </div>
                <FaArrowRight className="report-arrow" />
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default AllReportsPage;