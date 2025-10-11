import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api'; 
import Header from '../../components/Header'; 
import { Spinner, Button, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const EnrollmentPage = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('manage');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalContent, setModalContent] = useState({ title: '', message: '', variant: 'success' });

  const diasDaSemana = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const fetchData = useCallback(async () => {
    if (!user?.student_id) return;
    setLoading(true);
    try {
      const [coursesResponse, enrollmentsResponse] = await Promise.all([
        apiClient.get('/courses/'),
        apiClient.get(`/students/${user.student_id}/enrollments/`)
      ]);
      
      const allCourses = coursesResponse.data;
      const enrollmentsData = enrollmentsResponse.data;

      const studentEnrolledCourses = enrollmentsData.map(enrollment => {
        const courseDetails = allCourses.find(course => course.id === enrollment.course_.id);
        return courseDetails ? { ...courseDetails, enrollment_id: enrollment.id } : null;
      }).filter(Boolean);

      setAvailableCourses(allCourses);
      setEnrolledCourses(studentEnrolledCourses);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }, [user?.student_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showResultModal = (title, message, variant = 'success') => {
    setModalContent({ title, message, variant });
    setShowStatusModal(true);
  };

  const handleEnrollment = async (course) => {
    if (!user?.student_id) {
      showResultModal('Erro', 'Usuário não autenticado.', 'danger');
      return;
    }

    try {
      await apiClient.post('/enrollments/', { student_id: user.student_id, course_id: course.id });
      showResultModal('Sucesso!', `Matrícula em ${course.name} realizada com sucesso!`);
      fetchData();
    } catch (err) {
      showResultModal('Erro de Matrícula', err.response?.data?.detail || 'Tente novamente.', 'danger');
    }
  };

  const openConfirmModal = (course) => {
    setSelectedCourse(course);
    setShowConfirmModal(true);
  };

  const confirmUnenrollment = async () => {
    if (!selectedCourse) return;
    
    const enrollmentId = selectedCourse.enrollment_id;
    setShowConfirmModal(false);

    try {
      await apiClient.delete(`/enrollments/${enrollmentId}`);
      showResultModal('Sucesso!', `Matrícula em ${selectedCourse.name} cancelada.`);
      setEnrolledCourses(enrolledCourses.filter(c => c.enrollment_id !== enrollmentId));
    } catch (err) {
      showResultModal('Erro ao Cancelar', err.response?.data?.detail || 'Tente novamente.', 'danger');
    } finally {
      setSelectedCourse(null);
    }
  };

  const CourseList = ({ courses, onButtonClick, buttonText, buttonClass, emptyMessage }) => {
    if (courses.length === 0) {
      return <Alert variant="info" className="text-center">{emptyMessage}</Alert>;
    }

    return (
      <div className="row">
        {courses.map(course => (
          <div key={course.enrollment_id || course.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Professor(a): {course.teacher.name}</h6>
                <p className="card-text flex-grow-1">{course.description || "Sem descrição detalhada."}</p>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item px-0"><strong>Horários:</strong>
                    <div>{course.schedules?.map(s => <span key={s.id} className="badge bg-secondary me-1 mb-1">{`${diasDaSemana[s.day_of_week]}: ${s.start_time.slice(0,5)}-${s.end_time.slice(0,5)}`}</span>)}</div>
                  </li>
                  <li className="list-group-item px-0">
                    <strong>Período:</strong> {new Date(course.start_date).toLocaleDateString('pt-BR')} até {new Date(course.end_date).toLocaleDateString('pt-BR')}
                  </li>
                </ul>
                <button className={`btn ${buttonClass} mt-auto`} onClick={() => onButtonClick(course)}>{buttonText}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const coursesToEnroll = availableCourses.filter(ac => !enrolledCourses.some(ec => ec.id === ac.id));

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-3">Carregando...</p>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    
    if (activeTab === 'manage') {
      return <CourseList courses={enrolledCourses} onButtonClick={openConfirmModal} buttonText="Cancelar Matrícula" buttonClass="btn-danger" emptyMessage="Você não está matriculado em nenhuma matéria." />;
    }
    
    if (activeTab === 'enroll') {
      return <CourseList courses={coursesToEnroll} onButtonClick={handleEnrollment} buttonText="Matricular-se" buttonClass="btn-primary" emptyMessage="Nenhuma matéria disponível para matrícula." />;
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gerenciamento de Matrículas</h1>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>&larr; Voltar</Button>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>Minhas Matrículas</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'enroll' ? 'active' : ''}`} onClick={() => setActiveTab('enroll')}>Matricular-se</button>
          </li>
        </ul>

        <div className="tab-content">{renderContent()}</div>
      </div>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirmar Cancelamento</Modal.Title></Modal.Header>
        <Modal.Body>
          Tem certeza que deseja cancelar a matrícula em <strong>{selectedCourse?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Voltar</Button>
          <Button variant="danger" onClick={confirmUnenrollment}>Confirmar Cancelamento</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{modalContent.title}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Alert variant={modalContent.variant} className="m-0">{modalContent.message}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowStatusModal(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EnrollmentPage;