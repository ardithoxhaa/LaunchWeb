import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { ready, accessToken } = useAuth();

  if (!ready) return null;
  if (!accessToken) return <Navigate to="/login" replace />;
  return children;
}
