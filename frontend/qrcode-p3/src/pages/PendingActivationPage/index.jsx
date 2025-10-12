import React, { useEffect } from 'react';
import Header from '../../components/Header';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { BsClockHistory } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const PendingActivationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      const destination = {
        student: '/student',
        teacher: '/professor',
        admin: '/admin'
      }[user.role] || '/';
      navigate(destination, { replace: true });
    } else {
      if (!location.state?.email) {
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate, location.state]);

  const email = location.state?.email;

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (loading || (!user && !location.state?.email)) {
    return (
          <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
            <Spinner animation="border" role="status" />
            <p className="mt-3">Carregando...</p>
          </div>
    );
  }

  return (
    <>
      <Header />
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Card className="text-center shadow-sm" style={{ maxWidth: '500px' }}>
          <Card.Header as="h5">Conta Pendente de Ativação</Card.Header>
          <Card.Body className="p-4">
            <BsClockHistory size={50} className="text-warning mb-3" />
            <Card.Title>Aguardando Aprovação</Card.Title>
            {email && <p className="text-muted mt-2">Para o e-mail: <strong>{email}</strong></p>}
            <Alert variant="warning" className="mt-3">
              Seu registro foi concluído, mas sua conta ainda precisa ser ativada por um administrador.
            </Alert>
            <Card.Text className="text-muted">
              Por favor, aguarde.
            </Card.Text>
            <Button variant="outline-secondary" onClick={handleGoToLogin} className="mt-3">
              Voltar para o Login
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default PendingActivationPage;