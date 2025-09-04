import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { BsPersonCircle, BsCheckCircle, BsXCircle } from "react-icons/bs";
import './userManagement.css';

// dados mockados
const mockUsers = [
  { id: 2, name: 'Ranilson', role: 'Professor', email: 'ranilson@ic.ufal.br' },
  { id: 4, name: 'M. Hozano', role: 'Professor', email: 'mhozano@ic.ufal.br' },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simula tempo de carregamento
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApproveUser = (userId, userName) => {
    // aprova usuário
    console.log(`Aprovando usuário ID: ${userId}, Nome: ${userName}`);
    alert(`Usuário ${userName} aprovado!`);
  };

  const handleDenyUser = (userId, userName) => {
    // negar/remover usuário
    console.log(`Negando usuário ID: ${userId}, Nome: ${userName}`);
    alert(`Usuário ${userName} negado/removido!`);
  };

  if (loading) {
    return <div className="loading"><h1>Carregando usuários...</h1></div>;
  }

  return (
    <>
      <Header />
      <div className="user-management-container">
        <div className="user-list">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-avatar-wrapper">
              <div className="user-avatar">
                <BsPersonCircle />
              </div>
            </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
              <div className="user-email">
                {user.email}
              </div>
              <div className="action-buttons">
                <button 
                  className="action-btn deny-btn" 
                  onClick={() => handleDenyUser(user.id, user.name)}
                  aria-label={`Negar ${user.name}`}
                >
                  <BsXCircle />
                </button>
                <button 
                  className="action-btn approve-btn" 
                  onClick={() => handleApproveUser(user.id, user.name)}
                  aria-label={`Aprovar ${user.name}`}
                >
                  <BsCheckCircle />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserManagementPage;