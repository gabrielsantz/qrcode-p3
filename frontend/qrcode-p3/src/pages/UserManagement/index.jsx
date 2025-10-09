import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { BsPersonCircle, BsCheckCircle, BsXCircle } from "react-icons/bs";
import './userManagement.css';
import apiClient from '../../api';
import { Spinner, Alert, Container } from 'react-bootstrap';

const UserManagementPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  
  const roleTranslations = {
    student: 'Estudante',
    teacher: 'Professor',
    admin: 'Admin'
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const [pendingResponse, activeResponse] = await Promise.all([
          apiClient.get('/users/inactive_users'),
          apiClient.get('/users/active_users')
        ]);
        setPendingUsers(pendingResponse.data || []);
        setActiveUsers(activeResponse.data || []);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setError("Não foi possível carregar as listas de usuários.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleApproveUser = async (userId, userName) => {
    setUpdatingUserId(userId);
    try {
      await apiClient.post('/users/activate', null, { params: { user_id: userId } });
      
      const approvedUser = pendingUsers.find(u => u.id === userId);
      if (approvedUser) {
        setPendingUsers(current => current.filter(user => user.id !== userId));
        setActiveUsers(current => [...current, { ...approvedUser, is_active: true }]);
      }
      
      alert(`Usuário ${userName} aprovado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao aprovar usuário ${userId}:`, err);
      alert(`Ocorreu um erro ao aprovar ${userName}.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId, userName, listType) => {
    if (!window.confirm(`Tem certeza que deseja remover o usuário ${userName}?`)) {
      return;
    }
    setUpdatingUserId(userId);
    try {
      await apiClient.delete(`/users/${userId}`);

      if (listType === 'pending') {
        setPendingUsers(current => current.filter(user => user.id !== userId));
      } else {
        setActiveUsers(current => current.filter(user => user.id !== userId));
      }

      alert(`Usuário ${userName} foi removido.`);
    } catch (err) {
      console.error(`Erro ao remover usuário ${userId}:`, err);
      alert(`Ocorreu um erro ao remover ${userName}.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const renderUserList = (users, listType) => {
    if (users.length === 0) {
      const message = listType === 'pending'
        ? "Nenhum usuário pendente de aprovação."
        : "Nenhum usuário ativo encontrado.";
      return <Alert variant="info">{message}</Alert>;
    }

    return (
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar-wrapper">
              <div className="user-avatar"><BsPersonCircle /></div>
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`role-badge role-${user.role.toLowerCase()}`}>{roleTranslations[user.role.toLowerCase()] || user.role}</span>
            </div>
            <div className="user-email">{user.email}</div>
            <div className="action-buttons">
              <button 
                className="action-btn deny-btn" 
                onClick={() => handleDeleteUser(user.id, user.name, listType)}
                disabled={updatingUserId === user.id}
                aria-label={`Remover ${user.name}`}
              >
                <BsXCircle />
              </button>
              {listType === 'pending' && (
                <button 
                  className="action-btn approve-btn" 
                  onClick={() => handleApproveUser(user.id, user.name)}
                  disabled={updatingUserId === user.id}
                  aria-label={`Aprovar ${user.name}`}
                >
                  <BsCheckCircle />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderContent = () => {
    return activeTab === 'pending' 
      ? renderUserList(pendingUsers, 'pending')
      : renderUserList(activeUsers, 'active');
  };

  return (
    <>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4">Gerenciamento de Usuários</h1>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'active' ? 'active' : ''}`} 
              onClick={() => setActiveTab('active')}
            >
              Usuários Ativos ({activeUsers.length})
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} 
              onClick={() => setActiveTab('pending')}
            >
              Pendentes ({pendingUsers.length})
            </button>
          </li>
        </ul>
        
        {renderContent()}
      </Container>
    </>
  );
};

export default UserManagementPage;