import React, { useState } from 'react';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; // 1. Importar o Header

function RegisterPage({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const body = role === 'student' 
        ? { name, registration, email, password, role }
        : { name, email, password, role };
        
      const response = await apiClient.post('/auth/register', body);

      alert('Registro realizado com sucesso! Você será redirecionado para a página de login.');

      navigate('/login');

      if (onRegisterSuccess) {
        onRegisterSuccess(response.data);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || 'Erro ao registrar. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    if (newRole !== 'student') {
      setRegistration('');
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Header />

      <div className="d-flex justify-content-center align-items-center flex-grow-1 white">
        <div className="card shadow p-4" style={{ maxWidth: '450px', width: '100%' }}>
          <h2 className="text-center mb-4">Registro</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {role === 'student' && (
              <div className="mb-3">
                <label htmlFor="registration" className="form-label">Matrícula</label>
                <input
                  type="text"
                  className="form-control"
                  id="registration"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  required={role === 'student'}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">Cargo</label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={handleRoleChange}
                disabled={isLoading}
              >
                <option value="student">Estudante</option>
                <option value="teacher">Professor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;