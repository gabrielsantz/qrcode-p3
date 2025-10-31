import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './checkReportData.css';
import apiClient from '../../api';
import { Spinner, Alert, Container, Table, Button, Card } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const StatCard = ({ title, value, subtitle }) => (
  <div className="stat-card">
    <span className="stat-title">{title}</span>
    <span className="stat-value">{value}</span>
    {subtitle && <span className="stat-subtitle">{subtitle}</span>}
  </div>
);

const CheckDataPage = () => {
  const { classSessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!classSessionId) {
        setError("ID do relatório não encontrado na URL.");
        setLoading(false);
        return;
      }
      try {
        const [sessionResponse, attendanceResponse] = await Promise.all([
          apiClient.get(`/class_session/${classSessionId}`),
          apiClient.get(`/attendance/class_session/${classSessionId}`)
        ]);

        setSessionData(sessionResponse.data);
        setAttendances(attendanceResponse.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados do relatório:", err);
        setError("Não foi possível carregar os dados do relatório.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [classSessionId]);

  const statistics = useMemo(() => {
    if (!attendances || attendances.length === 0) {
      return { presentStudents: '0', presencePercentage: '0%', averageArrivalTime: 'N/A' };
    }

    const presentStudentsList = attendances.filter(a => a.attended);
    const presentCount = presentStudentsList.length;
    const totalStudents = attendances.length;
    const presencePercentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(0) + '%' : '0%';

    let averageArrivalTime = 'N/A';
    const studentsForAverage = presentStudentsList.filter(student => student.arrival_time);
    const countForAverage = studentsForAverage.length;

    if (countForAverage > 0) {
      const parseToSeconds = (val) => {
        if (!val) return 0;
        if (/^\d{2}:\d{2}:\d{2}$/.test(val)) {
          const [h, m, s] = val.split(':').map(Number);
          return h * 3600 + m * 60 + s;
        }
        const d = new Date(val);
        if (isNaN(d)) return 0;
        const hh = d.toLocaleTimeString('pt-BR', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Sao_Paulo',
        });
        const [h, m, s] = hh.split(':').map(Number);
        return h * 3600 + m * 60 + s;
      };

      const totalSeconds = studentsForAverage.reduce((acc, student) => acc + parseToSeconds(student.arrival_time), 0);

      const avgSeconds = totalSeconds / countForAverage;
      const hours = Math.floor(avgSeconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((avgSeconds % 3600) / 60).toString().padStart(2, '0');
      averageArrivalTime = `${hours}:${minutes}`;
    }
    
    return { presentStudents: presentCount.toString(), presencePercentage, averageArrivalTime };
  }, [attendances]);

  const handleSavePDF = async () => {
  const idDaAula = classSessionId;

  if (!idDaAula) {
    alert("Não foi possível identificar o ID da aula para gerar o PDF.");
    return;
  }

  try {
      const response = await apiClient.get(`/class_session/generate_pdf/${idDaAula}`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'relatorio.pdf'; 
      if (contentDisposition) {
      let fileNameMatch = contentDisposition.match(/filename="([^"]+)"/);
      
      if (!fileNameMatch) {
        fileNameMatch = contentDisposition.match(/filename=([^;]+)/);
      }
      
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    }
      
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      alert("Não foi possível gerar o PDF. Verifique o console para mais detalhes.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
        <Spinner animation="border" />
        <p className="mt-3">Carregando relatório...</p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
        <Container className="mt-4">
            <Alert variant="danger">{error || 'Relatório não encontrado.'}</Alert>
        </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-4 report-stats-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Detalhes do Relatório</h1>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" />
            Voltar
          </Button>
        </div>
        
        <Card className="mb-4">
            <Card.Header>Informações da Aula</Card.Header>
            <Card.Body>
                <Card.Title>{sessionData.course?.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    Prof. {sessionData.course?.teacher?.name}
                </Card.Subtitle>
            </Card.Body>
        </Card>

        <div className="stats-grid">
          <StatCard title="Alunos presentes" value={statistics.presentStudents} />
          <StatCard title="Porcentagem de presença" value={statistics.presencePercentage} />
          <StatCard title="Horário médio de chegada" value={statistics.averageArrivalTime} />
        </div>

        <h3 className="mt-5 mb-3">Lista de Chamada</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Chegada</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((aluno) => (
              <tr key={aluno.student_registration}>
                <td>{aluno.student_name}</td>
                <td>{aluno.student_registration}</td>
                <td>{(() => {
                  const v = aluno.arrival_time;
                  if (!v) return '--:--';
                  if (/^\d{2}:\d{2}:\d{2}$/.test(v)) return v;
                  const d = new Date(v);
                  if (isNaN(d)) return String(v);
                  return d.toLocaleTimeString('pt-BR', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'America/Sao_Paulo',
                  });
                })()}</td>
                <td>{aluno.attended ? 'Presente' : 'Ausente'}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="pdf-button-container text-end">
          <Button variant="primary" onClick={handleSavePDF}>
            Salvar como PDF
          </Button>
        </div>
      </Container>
    </>
  );
};

export default CheckDataPage;