import React, { useState, useEffect } from 'react';
import apiClient from '../../api';
import Header from '../../components/Header';
import { useAuth } from '../../AuthContext';

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [presencas, setPresencas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [materiaSelecionada, setMateriaSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');

  useEffect(() => {
    const fetchPresencas = async () => {
      if (!user?.student_id) {
        setLoading(false);
        setError("ID do estudante não encontrado. Faça login novamente.");
        return;
      }
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
          setError("Erro de conexão. Verifique sua internet e tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPresencas();
  }, [user?.student_id]);

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(`${dataString}T00:00:00`);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatarHora = (dataHoraString) => {
    if (!dataHoraString) return '—';
    const data = new Date(dataHoraString);
    return data.toLocaleTimeString('pt-BR');
  };

  if (loading) {
    return (
      <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Carregando histórico...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Ocorreu um Erro!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const materiasUnicas = [...new Set(presencas.map(item => item.course_name))];

  const presencasFiltradas = presencas.filter(item => {
    const filtroMateriaOk = materiaSelecionada ? item.course_name === materiaSelecionada : true;
    const filtroDataOk = dataSelecionada ? item.date === dataSelecionada : true;
    return filtroMateriaOk && filtroDataOk;
  });

  return (
    <>
      <Header /> 
      
      <div className="container mt-4">
        <h1 className="mb-4">Histórico de Presenças</h1>

        <div className="row g-3 mb-4">
          <div className="col-md-5">
            <label htmlFor="materia-select" className="form-label">Filtrar por Matéria:</label>
            <select
              id="materia-select"
              className="form-select"
              value={materiaSelecionada}
              onChange={(e) => setMateriaSelecionada(e.target.value)}
            >
              <option value="">Todas as matérias</option>
              {materiasUnicas.map(materia => (
                <option key={materia} value={materia}>
                  {materia}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-5">
            <label htmlFor="date-select" className="form-label">Filtrar por Data:</label>
            <input
              type="date"
              id="date-select"
              className="form-control"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Matéria</th>
                <th scope="col">Data da Aula</th>
                <th scope="col">Hora da Marcação</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {presencasFiltradas.length > 0 ? (
                presencasFiltradas.map((item) => (
                  <tr key={item.id}>
                    <td>{item.course_name}</td>
                    <td>{formatarData(item.date)}</td>
                    <td>{item.present ? formatarHora(item.marked_at) : '—'}</td>
                    <td>
                      <span className={`badge ${item.present ? 'bg-success' : 'bg-danger'}`}>
                        {item.present ? 'Presente' : 'Ausente'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Nenhum registro encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendanceHistory;