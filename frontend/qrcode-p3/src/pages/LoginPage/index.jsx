import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api';
import { useAuth } from '../../AuthContext';
import Header from '../../components/Header';
import { Spinner } from 'react-bootstrap';

function LoginPage({ onLoginSuccess }) {

  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      let destination = '/';
      switch (user.role) {
        case 'student': destination = '/student'; break;
        case 'teacher': destination = '/professor'; break;
        case 'admin': destination = '/admin'; break;
      }
      if (destination !== '/') {
        navigate(destination, { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data: loginData } = await apiClient.post('/auth/token', { email, password });
      localStorage.setItem('access_token', loginData.access_token);
      const { data: me } = await apiClient.get('/auth/me');
      setUser(me);
      if (onLoginSuccess) onLoginSuccess(me);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 white">
        <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Senha</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;