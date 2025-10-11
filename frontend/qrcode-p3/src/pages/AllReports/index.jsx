import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './allReports.css';
import apiClient from '../../api';
import { Spinner, Alert, Container } from 'react-bootstrap';

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

  const groupedReports = useMemo(() => {
    if (!reports) return {};
    
    return reports.reduce((acc, report) => {
      const reportDate = new Date(report.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      if (!acc[reportDate]) {
        acc[reportDate] = [];
      }
      acc[reportDate].push(report);
      return acc;
    }, {});
  }, [reports]);

    if (loading) {
      return (
        <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Carregando relatórios...</p>
        </div>
      );
    }

  if (error) {
    return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4">Todos os Relatórios</h1>
        
        {Object.keys(groupedReports).length > 0 ? (
          Object.entries(groupedReports).map(([date, reportsOnDate]) => (
            <div key={date} className="report-date-group mb-4">
              <h2 className="report-date-header">Dia {date}:</h2>
              {reportsOnDate.map(report => (
                <button
                  key={report.id}
                  className="report-card"
                  onClick={() => navigate(`/admin/all-reports/check-data/${report.id}`)}
                >
                  <div className="report-info">
                    <span className="report-subject-name">{report.course?.name}</span>
                    <span className="report-professor-name">Prof. {report.course?.teacher?.name}</span>
                  </div>
                  <FaArrowRight className="report-arrow" />
                </button>
              ))}
            </div>
          ))
        ) : (
          <Alert variant="info">Nenhum relatório encontrado.</Alert>
        )}
      </Container>
    </>
  );
};

export default AllReportsPage;