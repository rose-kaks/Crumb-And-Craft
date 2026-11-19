
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function ProtectedRoute({
  allowedRoles = [],
  children
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
