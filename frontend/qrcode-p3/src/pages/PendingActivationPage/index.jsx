import React from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../AuthContext';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { BsClockHistory } from 'react-icons/bs';

const PendingActivationPage = () => {
  const { logout } = useAuth();

  return (
    <>
      <Header />
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Card className="text-center shadow-sm" style={{ maxWidth: '500px' }}>
          <Card.Header as="h5">Conta Pendente de Ativação</Card.Header>
          <Card.Body className="p-4">
            <BsClockHistory size={50} className="text-warning mb-3" />
            <Card.Title>Aguardando Aprovação</Card.Title>
            <Alert variant="warning" className="mt-3">
              Seu registro foi concluído com sucesso, mas sua conta ainda precisa ser ativada por um administrador.
            </Alert>
            <Card.Text className="text-muted">
              Por favor, aguarde. Você será notificado quando sua conta for aprovada.
            </Card.Text>
            <Button variant="outline-secondary" onClick={logout} className="mt-3">
              Sair
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default PendingActivationPage;