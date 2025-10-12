import React, { useState, useEffect } from 'react';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../AuthContext';
import { Spinner } from 'react-bootstrap';

function RegisterPage({ onRegisterSuccess }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      const destination = { student: '/student', teacher: '/professor', admin: '/admin' }[user.role] || '/';
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate]);

  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');

  const [apiError, setApiError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('O e-mail é obrigatório.');
    } else if (value.includes('@') && !value.toLowerCase().endsWith('@ic.ufal.br')) {
      setEmailError('O e-mail deve ser institucional (@ic.ufal.br).');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (pass, confirmPass) => {
    if (!pass) {
      setPasswordError('A senha é obrigatória.');
    } else if (pass.length < 8) {
      setPasswordError('A senha deve ter no mínimo 8 caracteres.');
    } else if (pass !== confirmPass && confirmPass) {
      setPasswordError('As senhas não coincidem.');
    } else {
      setPasswordError('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value, confirmPassword);
  };
  
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    validatePassword(password, e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailError || passwordError) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const body = role === 'student'
        ? { name, registration, email, password, role }
        : { name, email, password, role };
      await apiClient.post('/auth/register', body);
      navigate('/login', { state: { successMessage: 'Registro realizado com sucesso! Aguarde a ativação da sua conta.' } });
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Erro ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (e.target.value !== 'student') {
      setRegistration('');
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" /></div>;
  }

  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 white">
        <div className="card shadow p-4" style={{ maxWidth: '450px', width: '100%' }}>
          <h2 className="text-center mb-4">Registro</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name">Nome Completo</label>
              <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email Institucional</label>
              <input type="email" id="email" className={`form-control ${emailError ? 'is-invalid' : ''}`} value={email} onChange={handleEmailChange} required disabled={isLoading} />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>
            {role === 'student' && (
              <div className="mb-3">
                <label htmlFor="registration">Matrícula</label>
                <input type="text" id="registration" className="form-control" value={registration} onChange={(e) => setRegistration(e.target.value)} required={role === 'student'} disabled={isLoading} />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" className={`form-control ${passwordError ? 'is-invalid' : ''}`} value={password} onChange={handlePasswordChange} required disabled={isLoading} />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input type="password" id="confirmPassword" className={`form-control ${passwordError ? 'is-invalid' : ''}`} value={confirmPassword} onChange={handleConfirmPasswordChange} required disabled={isLoading} />
              {passwordError && <div className="invalid-feedback d-block">{passwordError}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="role">Cargo</label>
              <select id="role" className="form-select" value={role} onChange={handleRoleChange} disabled={isLoading}>
                <option value="student">Estudante</option>
                <option value="teacher">Professor</option>
              </select>
            </div>
            {apiError && <div className="alert alert-danger text-center">{apiError}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading || !!emailError || !!passwordError}>
              {isLoading ? 'Registrando...' : 'Criar Conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;