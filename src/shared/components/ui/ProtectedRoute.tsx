import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';

interface ProtectedRouteProps {
  allowedRoles: Array<'ADMIN' | 'AIRLINE_STAFF' | 'PASSENGER'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(`ProtectedRoute: Role ${user.role} not in allowed roles ${allowedRoles}, redirecting to home`);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted for role', user.role);
  return <Outlet />;
};

export default ProtectedRoute;
