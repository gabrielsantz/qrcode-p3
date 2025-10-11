import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api';
import { Spinner, Alert, Container, Accordion, ListGroup, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const AllReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiClient.get('/class_session');
        setReports(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
        setError("Não foi possível carregar os relatórios. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const reportsByCourse = useMemo(() => {
    if (!reports) return {};

    const sorted = [...reports].sort((a, b) => new Date(b.date) - new Date(a.date));

    return sorted.reduce((acc, report) => {
      const courseName = report.course?.name || 'Matéria não especificada';
      if (!acc[courseName]) {
        acc[courseName] = [];
      }
      acc[courseName].push(report);
      return acc;
    }, {});
  }, [reports]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  if (loading) {
    return (
      <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Carregando relatórios...</p>
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
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Todos os Relatórios</h1>
            <Button variant="outline-secondary" onClick={() => navigate('/admin')}>
                <FaArrowLeft className="me-2" />
                Voltar
            </Button>
        </div>
        
        {Object.keys(reportsByCourse).length > 0 ? (
          <Accordion defaultActiveKey="0">
            {Object.entries(reportsByCourse).map(([courseName, reportsOnCourse], index) => (
              <Accordion.Item eventKey={String(index)} key={courseName}>
                <Accordion.Header>
                  <span className="fw-bold me-2">{courseName}</span>
                  <Badge bg="secondary" pill>
                    {reportsOnCourse.length} {reportsOnCourse.length > 1 ? 'relatórios' : 'relatório'}
                  </Badge>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {reportsOnCourse.map(report => (
                      <ListGroup.Item
                        key={report.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-bold">Data: {formatDate(report.date)}</div>
                          <small className="text-muted">
                            Prof. {report.course?.teacher?.name}
                          </small>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/admin/all-reports/check-data/${report.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Alert variant="info">Nenhum relatório encontrado.</Alert>
        )}
      </Container>
    </>
  );
};

export default AllReportsPage;