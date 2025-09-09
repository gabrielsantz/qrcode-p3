import React, { useState, useEffect } from 'react';
import apiClient from '../../api'; 
import Header from '../../components/Header'; 
import { useAuth } from '../../AuthContext';

const CoursesToEnroll = () => {
  const { user } = useAuth(); 
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const diasDaSemana = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {

        const response = await apiClient.get('/courses/');
        setCourses(response.data);
      } catch (err) {
        if (err.response) {
          console.error("Erro da API:", err.response.data);
          setError(`Erro ao buscar matérias: ${err.response.status} - ${err.response.data.detail || 'Tente novamente.'}`);
        } else {
          setError("Erro de conexão. Verifique sua internet e tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const data = new Date(`${dataString}T00:00:00`);
    return data.toLocaleDateString('pt-BR');
  };
  
  const formatarHora = (horaString) => {
    if (!horaString) return '';
    return horaString.substring(0, 5);
  };

  const handleEnrollment = (courseId, courseName) => {
    if (!user?.student_id) {
      alert('Usuário não autenticado ou sem ID de estudante.');
      return;
    }

    apiClient.post('/enrollments/', {
      student_id: user.student_id,
      course_id: courseId
    })
    .then(() => {
      alert(`Matrícula realizada com sucesso na matéria: ${courseName}!`);
    })
    .catch((err) => {
      if (err.response) {
        alert(`Erro ao matricular: ${err.response.data.detail || 'Tente novamente.'}`);
      } else {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    });
    
    console.log(`Tentativa de matrícula na matéria ID: ${courseId} para o aluno ID: ${user?.student_id}`);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <h4 className="mt-3">Carregando matérias disponíveis...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Ocorreu um Erro!</h4>
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="container mt-4 mb-5">
        <h1 className="mb-4">Matérias Disponíveis para Matrícula</h1>

        <div className="row">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="col-md-6 col-lg-4 mb-4">
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
                          {course.schedules.map(schedule => (
                            <span key={schedule.id} className="badge bg-secondary me-1">
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
                      className="btn btn-primary mt-auto" 
                      onClick={() => handleEnrollment(course.id, course.name)}
                    >
                      Matricular-se
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert">
                Nenhuma matéria disponível para matrícula no momento.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursesToEnroll;