// PrivateRoute.tsx

// src/components/Auth/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Adjust path if necessary

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Redirect to /unauthorized page
  }

  return <>{children}</>;
};

export default PrivateRoute;