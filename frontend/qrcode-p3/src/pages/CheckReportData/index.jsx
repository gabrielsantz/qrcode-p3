import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import './checkReportData.css';
import apiClient from '../../api';
import { Spinner, Alert, Container, Table, Button } from 'react-bootstrap';

const StatCard = ({ title, value, subtitle }) => (
  <div className="stat-card">
    <span className="stat-title">{title}</span>
    <span className="stat-value">{value}</span>
    {subtitle && <span className="stat-subtitle">{subtitle}</span>}
  </div>
);

const CheckDataPage = () => {
  const { classSessionId } = useParams();
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
      return {
        presentStudents: '0',
        presencePercentage: '0%',
        averageArrivalTime: 'N/A',
      };
    }

    const presentStudentsList = attendances.filter(a => a.attended);
    const presentCount = presentStudentsList.length;
    const totalStudents = attendances.length;

    const presencePercentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(0) + '%' : '0%';

    let averageArrivalTime = 'N/A';
    
    const studentsForAverage = presentStudentsList.filter(student => student.arrival_time);
    const countForAverage = studentsForAverage.length;

    if (countForAverage > 0) {
      const totalSeconds = studentsForAverage.reduce((acc, student) => {
        const timeParts = student.arrival_time.split(':');
        const seconds = (+timeParts[0]) * 3600 + (+timeParts[1]) * 60 + (+timeParts[2]);
        return acc + seconds;
      }, 0);

      const avgSeconds = totalSeconds / countForAverage;
      const hours = Math.floor(avgSeconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((avgSeconds % 3600) / 60).toString().padStart(2, '0');
      averageArrivalTime = `${hours}:${minutes}`;
    }
    
    return {
      presentStudents: presentCount.toString(),
      presencePercentage,
      averageArrivalTime,
    };
  }, [attendances]);

  const handleSavePDF = () => {
    alert('Implementar a função de salvar como PDF!');
  };

  if (loading) {
    return (
        <div className="text-center mt-5">
            <Spinner animation="border" />
            <p className="mt-2">Carregando relatório...</p>
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
        <div className="report-header">
          <span className="report-materia">{sessionData.course?.name}</span>
          <span className="report-professor">Prof. {sessionData.course?.teacher?.name}</span>
        </div>

        <div className="stats-grid">
          <StatCard 
            title="Alunos presentes" 
            value={statistics.presentStudents}
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
                <td>{aluno.arrival_time || '--:--'}</td>
                <td>{aluno.attended ? 'Presente' : 'Ausente'}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="pdf-button-container">
          <Button variant="primary" onClick={handleSavePDF}>
            Salvar como PDF
          </Button>
        </div>
      </Container>
    </>
  );
};

export default CheckDataPage;