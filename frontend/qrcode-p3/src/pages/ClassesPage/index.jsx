import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api';
import Header from '../../components/Header';
import { useAuth } from '../../AuthContext';


import { Accordion, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';

const ClassesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [classSessions, setClassSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassSessions = async () => {
            if (!user?.teacher_id) {
                setError("Não foi possível identificar o professor. Por favor, faça login novamente.");
                setLoading(false);
                return;
            }

            try {
                const response = await apiClient.get(`/class_session/teacher/${user.teacher_id}`);
                setClassSessions(response.data || []);
            } catch (err) {
                console.error("Erro ao buscar aulas:", err);
                setError("Não foi possível carregar as aulas. Verifique sua conexão e tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchClassSessions();
    }, [user?.teacher_id]);

    const groupedSessions = useMemo(() => {
        return classSessions.reduce((acc, session) => {
            const courseName = session.course?.name || 'Matéria não especificada';
            if (!acc[courseName]) {
                acc[courseName] = [];
            }
            acc[courseName].push(session);
            return acc;
        }, {});
    }, [classSessions]);

    const handleSelectSession = (sessionId) => {
        navigate(`/professor/qr-code/${sessionId}`);
    };
    
    const formatarData = (dataString) => {
        const data = new Date(`${dataString}T00:00:00`);
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    if (loading) {
        return (
        <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
            <Spinner animation="border" role="status" />
            <p className="mt-3">Carregando suas aulas...</p>
        </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Ocorreu um erro</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h1 className="mb-3">Selecionar Aula</h1>
                <p className="lead mb-4">Escolha uma aula abaixo para iniciar a chamada e gerar o QR Code.</p>

                {Object.keys(groupedSessions).length > 0 ? (
                    <Accordion defaultActiveKey="0">
                        {Object.entries(groupedSessions).map(([courseName, sessions], index) => (
                            <Accordion.Item eventKey={String(index)} key={courseName}>
                                <Accordion.Header>{courseName}</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup>
                                        {sessions.map((session) => (
                                            <ListGroup.Item
                                                key={session.id}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <span>
                                                    Aula do dia: <strong>{formatarData(session.date)}</strong>
                                                </span>
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={() => handleSelectSession(session.id)}
                                                >
                                                    Iniciar Chamada
                                                </Button>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <Alert variant="info">Você não possui aulas futuras cadastradas.</Alert>
                )}
            </div>
        </>
    );
};

export default ClassesPage;