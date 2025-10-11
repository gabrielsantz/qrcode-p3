import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { BsPersonCircle, BsCheckCircle, BsXCircle, BsPencilSquare } from "react-icons/bs";
import './userManagement.css';
import apiClient from '../../api';
import { Spinner, Alert, Container, Modal, Button, Form } from 'react-bootstrap';

const UserManagementPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });
  
  const roleTranslations = {
    student: 'Estudante',
    teacher: 'Professor',
    admin: 'Admin'
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const [pendingResponse, activeResponse] = await Promise.all([
          apiClient.get('/users/inactive_users'),
          apiClient.get('/users/active_users')
        ]);
        setPendingUsers(pendingResponse.data || []);
        setActiveUsers(activeResponse.data || []);
      } catch (err) {
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
        setActiveUsers(current => [...current, { ...approvedUser, is_active: true }].sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (err) {
      alert(`Ocorreu um erro ao aprovar ${userName}.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    setUpdatingUserId(selectedUser.id);
    setShowDeleteModal(false);
    try {
      await apiClient.delete(`/users/${selectedUser.id}`);
      if (selectedUser.is_active) {
        setActiveUsers(current => current.filter(user => user.id !== selectedUser.id));
      } else {
        setPendingUsers(current => current.filter(user => user.id !== selectedUser.id));
      }
    } catch (err) {
      alert(`Ocorreu um erro ao remover ${selectedUser.name}.`);
    } finally {
      setUpdatingUserId(null);
      setSelectedUser(null);
    }
  };

  const handleDeactivateUser = async () => {
    if (!selectedUser) return;

    setUpdatingUserId(selectedUser.id);
    try {
      await apiClient.post(`/users/deactivate`, null, { params: { user_id: selectedUser.id } });

      const userToDeactivate = activeUsers.find(u => u.id === selectedUser.id);
      if (userToDeactivate) {
        setActiveUsers(current => current.filter(user => user.id !== selectedUser.id));
        setPendingUsers(current => [...current, { ...userToDeactivate, is_active: false }].sort((a,b) => a.name.localeCompare(b.name)));
      }
      setShowEditModal(false);
    } catch (err) {
      alert(`Ocorreu um erro ao desativar ${selectedUser.name}.`);
    } finally {
      setUpdatingUserId(null);
      setSelectedUser(null);
    }
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
    setShowEditModal(true);
  };
  
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUpdatingUserId(selectedUser.id);
    try {
      await apiClient.put(`/users/${selectedUser.id}`, editFormData);
      
      const updateUserInList = (list) => list.map(u => u.id === selectedUser.id ? { ...u, ...editFormData } : u);
      
      if (selectedUser.is_active) {
        setActiveUsers(updateUserInList);
      } else {
        setPendingUsers(updateUserInList);
      }
      setShowEditModal(false);
    } catch (err) {
      alert('Falha ao salvar as alterações.');
    } finally {
      setUpdatingUserId(null);
      setSelectedUser(null);
    }
  };

  const renderUserList = (users, listType) => {
    if (users.length === 0) {
      const message = listType === 'pending' ? "Nenhum usuário pendente de aprovação." : "Nenhum usuário ativo encontrado.";
      return <Alert variant="info">{message}</Alert>;
    }

    return (
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar-wrapper"><div className="user-avatar"><BsPersonCircle /></div></div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`role-badge role-${user.role.toLowerCase()}`}>{roleTranslations[user.role.toLowerCase()] || user.role}</span>
            </div>
            <div className="user-email">{user.email}</div>
            <div className="action-buttons">
              <button className="action-btn edit-btn" onClick={() => handleOpenEditModal(user)} disabled={updatingUserId === user.id}><BsPencilSquare /></button>
              <button className="action-btn deny-btn" onClick={() => handleOpenDeleteModal(user)} disabled={updatingUserId === user.id}><BsXCircle /></button>
              {listType === 'pending' && (
                <button className="action-btn approve-btn" onClick={() => handleApproveUser(user.id, user.name)} disabled={updatingUserId === user.id}><BsCheckCircle /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">

            <h1 className="mb-0">Gerenciamento de Usuários</h1>
            <Button variant="outline-secondary" onClick={() => history.back()}>
                &larr; Voltar
            </Button>
            
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item"><button className={`nav-link ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Usuários Ativos ({activeUsers.length})</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pendentes ({pendingUsers.length})</button></li>
        </ul>
        {loading ? <div className="text-center mt-5"><Spinner animation="border" /></div> : error ? <Alert variant="danger">{error}</Alert> : (activeTab === 'pending' ? renderUserList(pendingUsers, 'pending') : renderUserList(activeUsers, 'active'))}
      </Container>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Editar Usuário</Modal.Title></Modal.Header>
        <Form onSubmit={handleSaveChanges}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Nome</Form.Label><Form.Control type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} required /></Form.Group>
            <Form.Group><Form.Label>Cargo</Form.Label><Form.Select name="role" value={editFormData.role} onChange={handleEditFormChange}><option value="student">Estudante</option><option value="teacher">Professor</option><option value="admin">Admin</option></Form.Select></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {selectedUser?.is_active && (
              <Button variant="warning" onClick={handleDeactivateUser} disabled={updatingUserId === selectedUser?.id} className="me-auto">
                Desativar Usuário
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={updatingUserId === selectedUser?.id}>
              {updatingUserId === selectedUser?.id ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirmar Remoção</Modal.Title></Modal.Header>
        <Modal.Body>Tem certeza que deseja remover o usuário <strong>{selectedUser?.name}</strong>? Esta ação não pode ser desfeita.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDeleteUser}>Confirmar Remoção</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagementPage;