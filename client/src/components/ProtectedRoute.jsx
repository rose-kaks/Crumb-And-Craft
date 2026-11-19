
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({
  userRole,
  allowedRoles,
  children
}) {
  // No role selected
  if (!userRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check whether the user's role is permitted
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Permission granted
  return children;
}
