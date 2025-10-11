import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api';
import { Spinner, Alert, Container, Accordion, ListGroup, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const GroupedAttendancePage = () => {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await apiClient.get('/teacher/class_session');
        setAttendanceRecords(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
        setError("Não foi possível carregar o histórico de aulas.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceRecords();
  }, []);

  const reportsByCourse = useMemo(() => {
    if (!attendanceRecords) return {};

    const sortedRecords = [...attendanceRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

    return sortedRecords.reduce((acc, record) => {
      const courseName = record.course?.name || 'Matéria não especificada';
      if (!acc[courseName]) {
        acc[courseName] = [];
      }
      acc[courseName].push(record);
      return acc;
    }, {});
  }, [attendanceRecords]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
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
      <>
        <Header />
        <Container className="mt-4">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center">
        <h1>Relatórios de Aulas Passadas</h1>
        <Button variant="outline-secondary" onClick={() => history.back()}>
          &larr;
          Voltar
        </Button>
        </div>
        <p className="lead mb-4">Escolha uma aula abaixo para visualizar o relatório de presença.</p>

        
        {Object.keys(reportsByCourse).length > 0 ? (
          <Accordion defaultActiveKey="0">
            {Object.entries(reportsByCourse).map(([courseName, reports], index) => (
              <Accordion.Item eventKey={String(index)} key={courseName}>
                <Accordion.Header>
                  <span className="fw-bold me-2">{courseName}</span>
                  <Badge bg="secondary" pill>
                    {reports.length} {reports.length > 1 ? 'relatórios' : 'relatório'}
                  </Badge>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {reports.map(report => (
                      <ListGroup.Item
                        key={report.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-bold">Aula do dia: {formatDate(report.date)}</div>
                          <small className="text-muted">
                            {report.start_time?.slice(0, 5)} - {report.end_time?.slice(0, 5)}
                          </small>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/professor/reports/past-report/${report.id}`)}
                        >
                          Ver Relatório
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Alert variant="info">Nenhum relatório de aulas passadas encontrado.</Alert>
        )}
      </Container>
    </>
  );
};

export default GroupedAttendancePage;