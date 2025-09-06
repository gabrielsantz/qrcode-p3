import React, { useState, useEffect } from 'react';
import apiClient from '../../api';
import Header from '../../components/Header';
import { useAuth } from '../../AuthContext';
import './attendance.css';

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [presencas, setPresencas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [materiaSelecionada, setMateriaSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');

  useEffect(() => {
    const fetchPresencas = async () => {
      try {
        const response = await apiClient.get(`/student/attendances?student_id=${user.student_id}`);
        const fetchedAttendances = response.data.attendances || [];

        const sortedAttendances = fetchedAttendances.sort((a, b) => {
          const dateA = new Date(a.marked_at || a.date);
          const dateB = new Date(b.marked_at || b.date);
          return dateB - dateA; 
        });

        setPresencas(sortedAttendances);
      } catch (err) {
        if (err.response) {
          console.error("Erro da API:", err.response.data);
          setError(`Erro: ${err.response.status} - ${err.response.data.message || 'Não foi possível buscar os dados.'}`);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.student_id) {
      fetchPresencas();
    }
  }, [user?.student_id]);

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(`${dataString}T00:00:00`);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarHora = (dataHoraString) => {
    if (!dataHoraString) return '—';
    const data = new Date(dataHoraString);
    return data.toLocaleTimeString('pt-BR');
  };

  if (loading) {
    return <div className="loading"><h1>Carregando histórico...</h1></div>;
  }

  if (error) {
    return <div className="container"><h1>Erro: {error}</h1></div>;
  }

  const materiasUnicas = [...new Set(presencas.map(item => item.course_name))];

  const presencasFiltradas = presencas.filter(item => {
    const filtroMateriaOk = materiaSelecionada ? item.course_name === materiaSelecionada : true;
    const filtroDataOk = dataSelecionada ? item.date === dataSelecionada : true;
    return filtroMateriaOk && filtroDataOk;
  });

  return (
    <>
      <div className="header-container">
        <Header />
      </div>

      <div className="attendance-container">
        <h1 className="attendance-title">Histórico de presenças</h1>

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
              <th>ID da Aula</th>
              <th>Matéria</th>
              <th>Data da Aula</th>
              <th>Hora da Marcação</th> 
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {presencasFiltradas.map((item) => {
              const statusTexto = item.present ? 'Presente' : 'Ausente';
              const statusClasse = item.present ? 'presente' : 'ausente';
              
              const horaMarcacao = item.present ? formatarHora(item.marked_at) : '—';

              return (
                <tr key={item.id}>
                  <td>{item.id.substring(0, 8)}...</td>
                  <td>{item.course_name}</td>
                  <td>{formatarData(item.date)}</td>
                  <td>{horaMarcacao}</td>
                  <td>
                    <span className={`status status-${statusClasse}`}>
                      <span className="status-indicator"></span>
                      {statusTexto}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AttendanceHistory;