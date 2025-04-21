// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userType, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userType)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = `/${userType}/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }
  
  return <Outlet />;
};