import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api';
import { useAuth } from '../../AuthContext';
import './style.css';

function LoginPage({ onLoginSuccess }) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/token', { email, password });
      const { data: me } = await apiClient.get('/auth/me');
      setUser(me);
      switch (me.role) {
        case 'student': navigate('/student/'); break;
        case 'teacher': navigate('/professor/'); break;
        default: navigate('/');
      }
      if (onLoginSuccess) onLoginSuccess(me);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
  