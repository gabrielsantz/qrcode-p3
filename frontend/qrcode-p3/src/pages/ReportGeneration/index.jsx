import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api';
import Header from '../../components/Header';
import { Container, Table, Button, Badge, Card } from 'react-bootstrap';

const ReportGenerationPage = () => {
    const { classSessionId } = useParams(); 

    const [sessionInfo, setSessionInfo] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            if (!classSessionId) {
                setError("ID da aula não encontrado na URL.");
                setLoading(false);
                return;
            }

            try {
                const [attendancesResponse, sessionResponse] = await Promise.all([
                    apiClient.get(`/attendance/class_session/${classSessionId}`),
                    apiClient.get(`/class_session/${classSessionId}`) 
                ]);
                

                setAttendances(attendancesResponse.data || []);

                setSessionInfo(sessionResponse.data.course); 

            } catch (err) {
                console.error("Erro ao buscar dados da chamada:", err);
                setError("Não foi possível carregar os dados. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [classSessionId]);

    const handleSaveAsPDF = () => {
    console.log('Gerando PDF...');
      alert('Função de gerar PDF a ser implementada!');
      };

    
    return (
        <>
            <Header />
            <Container className="mt-4">
                <h1 className="mb-3">Relatório de Presença</h1>
                
                <Card className="mb-4">
                    <Card.Header as="h5">
                        Detalhes da Aula
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="h4">{sessionInfo?.name || 'Matéria não identificada'}</Card.Title>
                        <Card.Text>
                            Lista de alunos presentes na aula.
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className="text-center">Nome do Aluno</th>
                            <th className="text-center">Matrícula</th>
                            <th className="text-center">Horário de Chegada</th>
                            <th className="text-center">Presença</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.length > 0 ? (
                            attendances.map((att, index) => (
                                <tr key={index}>
                                    <td className="text-center">{att.student_name}</td>
                                    <td className="text-center">{att.student_registration}</td>
                                    <td className="text-center">{att.arrival_time || '--'}</td>
                                    <td className="text-center">
                                      <Badge bg={att.attended ? 'success' : 'danger'} pill>
                                        {att.attended ? 'Presente' : 'Ausente'}
                                      </Badge>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Nenhum aluno na lista de chamada para esta aula.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <div className="text-end mt-3">
                    <Button variant="primary" className="me-2" onClick={handleSaveAsPDF}>
                        Salvar como PDF
                    </Button>
                </div>
            </Container>
        </>
    );
};

export default ReportGenerationPage;