import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { BsCheckCircleFill } from 'react-icons/bs';

const ScanSuccess = ({ message }) => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="text-center shadow-sm" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body className="p-4">
          <BsCheckCircleFill size={60} className="text-success mb-3" />
          <Card.Title as="h2">Sucesso!</Card.Title>
          <Alert variant="success" className="mt-3">
            {message || 'Sua presença foi confirmada com sucesso.'}
          </Alert>
          <Button 
            variant="primary" 
            onClick={() => navigate('/student')} 
            className="mt-3 w-100"
          >
            Voltar para a Página Inicial
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ScanSuccess;