import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  const isAuthorized = user && allowedRoles.includes(user.role);

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  if (!isAuthorized) {
    const homePath = user.role === 'student' ? '/student' : '/teacher';
    return <Navigate to={homePath} replace />;
  }


  return <Outlet />;
}

export default ProtectedRoute;