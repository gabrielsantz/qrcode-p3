import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './attendance.css';

// simulação de dados
const mockData = [
  { id: 1, materia: 'Programação 3', data: '21/08/2025', status: 'Presente' },
  { id: 2, materia: 'Projeto e Análise de Algoritmos', data: '21/08/2025', status: 'Presente' },
  { id: 3, materia: 'Teoria da Computação', data: '20/08/2025', status: 'Ausente' },
  { id: 4, materia: 'Programação 2', data: '19/08/2025', status: 'Presente' },
  { id: 5, materia: 'Programação 3', data: '21/08/2025', status: 'Presente' },
  { id: 6, materia: 'Projeto e Análise de Algoritmos', data: '21/08/2025', status: 'Presente' },
  { id: 7, materia: 'Teoria da Computação', data: '20/08/2025', status: 'Ausente' },
  { id: 8, materia: 'Programação 2', data: '19/08/2025', status: 'Presente' },
  { id: 9, materia: 'Programação 3', data: '21/08/2025', status: 'Presente' },
  { id: 10, materia: 'Projeto e Análise de Algoritmos', data: '21/08/2025', status: 'Presente' },
  { id: 11, materia: 'Teoria da Computação', data: '20/08/2025', status: 'Ausente' },
  { id: 12, materia: 'Programação 2', data: '19/08/2025', status: 'Presente' }
];

const AttendanceHistory = () => {
  const [presencas, setPresencas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [materiaSelecionada, setMateriaSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');

  useEffect(() => {
    // Função para buscar os dados da API
    const fetchPresencas = async () => {
      try {
        // para quando conectar ao backend
        // const response = await fetch('https://api.com/student/attendance');
        // if (!response.ok) {
        //   throw new Error('Não foi possível buscar os dados.');
        // }
        // const data = await response.json();
        // setPresencas(data);

        // dados mockados
        await new Promise(resolve => setTimeout(resolve, 1000)); // simula um tempo de espera
        setPresencas(mockData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPresencas();
  }, []);

  if (loading) {
    return <div className="loading"><h1>Carregando histórico...</h1></div>;
  }

  if (error) {
    return <div className="container"><h1>Erro: {error}</h1></div>;
  }

  const materiasUnicas = [...new Set(mockData.map(item => item.materia))];

  return (
    <>
      <div className="header-container">
        <Header />
      </div>

      <div className="attendance-container">
        <h1 classname="attendance-title">Histórico de presenças</h1>
        
        <div className="filters-wrapper mb-4">
          <div className="filter-group">
            <label htmlFor="materia-select" className="filter-label">Matéria:</label>
            <select 
              id="materia-select"
              className="form-select"
              value={materiaSelecionada}
              onChange={(e) => setMateriaSelecionada(e.target.value)}
            >
              <option value="">Todas</option>
              {materiasUnicas.map(materia => (
                <option key={materia} value={materia}>
                  {materia}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date-select" className="filter-label">Data:</label>
            <input 
              type="date"
              id="date-select"
              className="form-control"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>
        </div>
        
        <table className="presence-table table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Matéria</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {presencas
              .filter(item => {
                const filtroMateriaOk = materiaSelecionada ? item.materia === materiaSelecionada : true;

                const filtroDataOk = dataSelecionada ? item.data === dataSelecionada.split('-').reverse().join('/') : true;
    
                return filtroMateriaOk && filtroDataOk;
              })
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.materia}</td>
                  <td>{item.data}</td>
                  <td>
                    <span className={`status status-${item.status.toLowerCase()}`}>
                      <span className="status-indicator"></span>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
  </>
  );
};

export default AttendanceHistory;
