import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

/**
 * Wraps a route element and redirects unauthenticated users to /login,
 * remembering the page they were trying to reach so we can send them
 * back after a successful login.
 *
 * Pass `adminOnly` to additionally require the "admin" role — non-admins
 * are redirected back to the dashboard instead of seeing the page.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="main-content">
        <div className="glass-panel">
          <LoadingSpinner label="Checking your session..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
