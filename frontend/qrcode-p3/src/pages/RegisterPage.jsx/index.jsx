import React, { useState } from 'react';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import './style.css'

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
      const body = { name, registration, email, password, role };
      const response = await apiClient.post('/auth/register', body);

      navigate('/login')
      

      if (onRegisterSuccess) {
        onRegisterSuccess(response.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Erro ao registrar. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registro</h2>

        <div className="input-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="registration">Matrícula</label>
          <input
            type="text"
            id="registration"
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="role">Papel</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="student">Estudante</option>
            <option value="teacher">Professor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
