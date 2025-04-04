// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // Si l'utilisateur n'est pas connecté ou n'a pas le bon rôle, redirigez-le
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;