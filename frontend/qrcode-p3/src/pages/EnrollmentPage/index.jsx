import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api'; 
import Header from '../../components/Header'; 
import { useAuth } from '../../AuthContext';

const EnrollmentPage = () => {
  const { user } = useAuth(); 
  
  const [activeTab, setActiveTab] = useState('manage');

  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [errorAvailable, setErrorAvailable] = useState(null);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [errorEnrolled, setErrorEnrolled] = useState(null);

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

    setLoadingAvailable(true);
    setLoadingEnrolled(true);

    try {
      const coursesResponse = await apiClient.get('/courses/');
      const allCourses = coursesResponse.data;
      setAvailableCourses(allCourses);
      setErrorAvailable(null);


      const enrollmentsResponse = await apiClient.get(`/students/${user.student_id}/enrollments/`);
      const enrollmentsData = enrollmentsResponse.data; 

      const studentEnrolledCourses = enrollmentsData.map(enrollment => {
      const courseDetails = allCourses.find(course => course.id === enrollment.course_.id);
      
      if (courseDetails) {
        return {
          ...courseDetails,
          enrollment_id: enrollment.id 
        };
      }
      return null;
      }).filter(Boolean);

      setEnrolledCourses(studentEnrolledCourses);
      setErrorEnrolled(null);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      const errorMessage = err.response ? `Erro: ${err.response.data.detail}` : 'Erro de conexão.';
      setErrorAvailable(errorMessage);
      setErrorEnrolled(errorMessage);
    } finally {
      setLoadingAvailable(false);
      setLoadingEnrolled(false);
    }
  }, [user?.student_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(`${dataString}T00:00:00`);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };
  
  const formatarHora = (horaString) => {
    if (!horaString) return '';
    return horaString.substring(0, 5);
  };

  const handleEnrollment = (course) => {
    if (!user?.student_id) {
      alert('Usuário não autenticado.');
      return;
    }

    apiClient.post('/enrollments/', {
      student_id: user.student_id,
      course_id: course.id
    })
    .then(() => {
      alert(`Matrícula realizada com sucesso em: ${course.name}!`);
      fetchData();
    })
    .catch((err) => {
      alert(`Erro ao matricular: ${err.response?.data?.detail || 'Tente novamente.'}`);
    });
  };
  

  const handleUnenrollment = (course) => {
    if (!window.confirm(`Tem certeza que deseja cancelar a matrícula em ${course.name}?`)) {
      return;
    }
    
    const enrollmentId = course.enrollment_id;

    apiClient.delete(`/enrollments/${enrollmentId}`)
    .then(() => {
      alert(`Matrícula em ${course.name} cancelada com sucesso.`);
      setEnrolledCourses(enrolledCourses.filter(c => c.enrollment_id !== enrollmentId));
    })
    .catch((err) => {
      alert(`Erro ao cancelar matrícula: ${err.response?.data?.detail || 'Tente novamente.'}`);
    });
  };

  const CourseList = ({ courses, onButtonClick, buttonText, buttonClass, emptyMessage, loading, error }) => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando matérias...</p>
        </div>
      );
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    if (courses.length === 0) {
      return <div className="alert alert-info text-center">{emptyMessage}</div>;
    }

    return (
      <div className="row">
        {courses.map(course => (
          <div key={course.enrollment_id || course.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Professor(a): {course.teacher.name}
                </h6>
                <p className="card-text flex-grow-1">
                  {course.description || "Esta matéria não possui uma descrição detalhada."}
                </p>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item px-0">
                    <strong>Horários:</strong>
                    <div>
                      {course.schedules?.map(schedule => (
                        <span key={schedule.id} className="badge bg-secondary me-1 mb-1">
                          {diasDaSemana[schedule.day_of_week]}: {formatarHora(schedule.start_time)} - {formatarHora(schedule.end_time)}
                        </span>
                      ))}
                    </div>
                  </li>
                  <li className="list-group-item px-0">
                    <strong>Período:</strong> {formatarData(course.start_date)} até {formatarData(course.end_date)}
                  </li>
                </ul>
                <button 
                  className={`btn ${buttonClass} mt-auto`}
                  onClick={() => onButtonClick(course)}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const coursesToEnroll = availableCourses.filter(
    ac => !enrolledCourses.some(ec => ec.id === ac.id)
  );

  return (
    <>
      <Header />
      
      <div className="container mt-4 mb-5">
        <h1 className="mb-4">Gerenciamento de Matrículas</h1>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`} 
              onClick={() => setActiveTab('manage')}
            >
              Minhas Matrículas
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'enroll' ? 'active' : ''}`} 
              onClick={() => setActiveTab('enroll')}
            >
              Matricular-se
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === 'manage' && (
            <div className="tab-pane fade show active">
               <CourseList
                courses={enrolledCourses}
                onButtonClick={handleUnenrollment}
                buttonText="Cancelar Matrícula"
                buttonClass="btn-danger"
                emptyMessage="Você ainda não está matriculado em nenhuma matéria."
                loading={loadingEnrolled}
                error={errorEnrolled}
              />
            </div>
          )}
          
          {activeTab === 'enroll' && (
            <div className="tab-pane fade show active">
              <CourseList
                courses={coursesToEnroll}
                onButtonClick={handleEnrollment}
                buttonText="Matricular-se"
                buttonClass="btn-primary"
                emptyMessage="Nenhuma nova matéria disponível para matrícula no momento."
                loading={loadingAvailable}
                error={errorAvailable}
              />
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default EnrollmentPage;