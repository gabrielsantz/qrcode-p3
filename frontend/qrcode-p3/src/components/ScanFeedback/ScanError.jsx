import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { BsXCircleFill } from 'react-icons/bs';

const ScanError = ({ message, onRetry }) => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="text-center shadow-sm" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body className="p-4">
          <BsXCircleFill size={60} className="text-danger mb-3" />
          <Card.Title as="h2">Ocorreu um Erro</Card.Title>
          <Alert variant="danger" className="mt-3">
            {message || 'Não foi possível registrar sua presença.'}
          </Alert>
          <Button 
            variant="secondary" 
            onClick={onRetry} 
            className="mt-3 w-100"
          >
            Escanear Novamente
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ScanError;