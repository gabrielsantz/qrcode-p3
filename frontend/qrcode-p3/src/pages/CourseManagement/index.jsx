import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header';
import apiClient from '../../api';
import { Container, Button, Modal, Form, Spinner, Alert, Card, ListGroup, InputGroup, Badge } from 'react-bootstrap';
import { FaPlus, FaPencilAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const initialFormState = {
    name: '',
    description: '',
    teacher_id: '',
    start_date: '',
    end_date: '',
    schedules: [{ day_of_week: 'monday', start_time: '08:00', end_time: '10:00' }],
  };
  const [formData, setFormData] = useState(initialFormState);

  const diasDaSemana = {
    monday: 'Segunda', tuesday: 'Terça', wednesday: 'Quarta',
    thursday: 'Quinta', friday: 'Sexta', saturday: 'Sábado',
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesResponse, teachersResponse] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/teacher'),
      ]);
      setCourses(coursesResponse.data || []);
      setTeachers(teachersResponse.data || []);
    } catch (err) {
      setError('Falha ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedCourse(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleOpenEditModal = (course) => {
    setIsEditing(true);
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      description: course.description || '',
      teacher_id: course.teacher.id,
      start_date: course.start_date,
      end_date: course.end_date,
      schedules: course.schedules.map(s => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time.slice(0, 5),
        end_time: s.end_time.slice(0, 5)
      })),
    });
    setShowModal(true);
  };
  
  const handleOpenDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...formData.schedules];
    newSchedules[index][name] = value;
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { day_of_week: 'monday', start_time: '08:00', end_time: '10:00' }],
    }));
  };

  const removeSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/courses/${selectedCourse.id}`, formData);
      } else {
        await apiClient.post('/courses', formData);
      }
      fetchData();
      handleCloseModals();
    } catch (err) {
      alert(`Erro: ${err.response?.data?.detail || 'Não foi possível salvar a matéria.'}`);
    }
  };
  
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/courses/${selectedCourse.id}`);
      fetchData();
      handleCloseModals();
    } catch (err) {
      alert(`Erro: ${err.response?.data?.detail || 'Não foi possível remover a matéria.'}`);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (courses.length === 0) {
      return <Alert variant="info">Nenhuma matéria cadastrada no momento.</Alert>;
    }

    return (
      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{course.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Prof. {course.teacher.name}</Card.Subtitle>
                <ListGroup variant="flush" className="my-3 flex-grow-1">
                  <ListGroup.Item>
                    <strong>Horários:</strong>
                    <div>{course.schedules?.map(s => <Badge key={s.id} bg="secondary" className="me-1">{`${diasDaSemana[s.day_of_week]}: ${s.start_time.slice(0,5)}`}</Badge>)}</div>
                  </ListGroup.Item>
                </ListGroup>
                <div className="mt-auto text-end">
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleOpenEditModal(course)}><FaPencilAlt /></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleOpenDeleteModal(course)}><FaTrash /></Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gerenciamento de Matérias</h1>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-1" /> Voltar
            </Button>
            <Button variant="primary" onClick={handleOpenAddModal}>
              <FaPlus className="me-2" />
              Adicionar Matéria
            </Button>
          </div>
        </div>
        {renderContent()}
      </Container>
      
      <Modal show={showModal} onHide={handleCloseModals} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Editar Matéria' : 'Adicionar Nova Matéria'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Nome da Matéria</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Descrição</Form.Label><Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleFormChange} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Professor</Form.Label><Form.Select name="teacher_id" value={formData.teacher_id} onChange={handleFormChange} required><option value="">Selecione um professor</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}</Form.Select></Form.Group>
            <div className="row mb-3"><div className="col"><Form.Group><Form.Label>Data de Início</Form.Label><Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleFormChange} required /></Form.Group></div><div className="col"><Form.Group><Form.Label>Data de Fim</Form.Label><Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleFormChange} required /></Form.Group></div></div>
            <Form.Label>Horários</Form.Label>
            {formData.schedules.map((schedule, index) => (
              <InputGroup className="mb-2" key={index}>
                <Form.Select name="day_of_week" value={schedule.day_of_week} onChange={e => handleScheduleChange(index, e)}>{Object.entries(diasDaSemana).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Form.Select>
                <Form.Control type="time" name="start_time" value={schedule.start_time} onChange={e => handleScheduleChange(index, e)} />
                <Form.Control type="time" name="end_time" value={schedule.end_time} onChange={e => handleScheduleChange(index, e)} />
                <Button variant="outline-danger" onClick={() => removeSchedule(index)} disabled={formData.schedules.length <= 1}>X</Button>
              </InputGroup>
            ))}
            <Button variant="outline-success" size="sm" onClick={addSchedule}>Adicionar Horário</Button>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={handleCloseModals}>Cancelar</Button><Button variant="primary" type="submit">Salvar</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseModals} centered>
        <Modal.Header closeButton><Modal.Title>Confirmar Remoção</Modal.Title></Modal.Header>
        <Modal.Body>Tem certeza que deseja remover a matéria <strong>{selectedCourse?.name}</strong>? Todas as aulas e registros de presença associados também serão removidos.</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={handleCloseModals}>Cancelar</Button><Button variant="danger" onClick={handleDelete}>Confirmar Remoção</Button></Modal.Footer>
      </Modal>
    </>
  );
};

export default CourseManagementPage;