import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export function AdminRoute({ children }) {
  const { ready, accessToken, user } = useAuth();

  if (!ready) return null;
  if (!accessToken) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}
