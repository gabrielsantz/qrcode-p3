import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './reports.css';

const mockData = [
  { id: 1, materia: 'Programação 3', data: '21/08/2025', status: 'Presente' },
  { id: 2, materia: 'Programação 1', data: '21/08/2025', status: 'Presente' },
  { id: 3, materia: 'Teoria da Computação', data: '20/08/2025', status: 'Ausente' },
  { id: 4, materia: 'Programação 2', data: '19/08/2025', status: 'Presente' },
  { id: 5, materia: 'Projeto e Análise de Algoritmos', data: '19/08/2025', status: 'Presente' },
  { id: 6, materia: 'Programação 1', data: '14/08/2025', status: 'Presente' },
];

const GroupedAttendancePage = () => {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const sortedData = mockData.sort((a, b) => new Date(b.data.split('/').reverse().join('-')) - new Date(a.data.split('/').reverse().join('-')));
      setAttendanceRecords(sortedData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className = "loading"><h1>Carregando...</h1></div>;
  }

  let lastDate = null;

  return (
    <>
      <Header />
      <div className="grouped-attendance-container">
        {attendanceRecords.map(record => {
          // verifica se a data do registro atual é diferente da última data
          const showDateHeader = record.data !== lastDate;
          
          // atualiza a última data para a data do registro atual
          lastDate = record.data;

          return (
            // React.Fragment para agrupar o cabeçalho e o card sem adicionar uma div extra
            <React.Fragment key={record.id}>
              {showDateHeader && (
                <div className="date-group">
                  <h2 className="date-header">Dia {record.data}:</h2>
                </div>
              )}
              
              <button
                className="subject-card"
                onClick={() => navigate(`/professor/reports/past-report/${record.id}`)}
              >
                <span className="subject-name">{record.materia}</span>
                <FaArrowRight className="subject-arrow" />
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default GroupedAttendancePage;