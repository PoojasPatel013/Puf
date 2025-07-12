import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/api';

export default function ProtectedRoute({ children }) {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}
