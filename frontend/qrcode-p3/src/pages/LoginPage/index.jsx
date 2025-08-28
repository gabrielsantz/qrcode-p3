import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api';
import { useAuth } from '../../AuthContext';

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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
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
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
