import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthProvider';

const ProtectedRoute = () => {
  const { accessToken } = useAuth();

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;