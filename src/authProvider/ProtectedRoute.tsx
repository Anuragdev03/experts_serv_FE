import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthProvider';
import { useLayoutEffect, useState } from 'react';
import Loader from '../components/Loader';
import { getAccessToken } from '../api/refreshToken';

const ProtectedRoute = () => {
  const { accessToken, storeToken } = useAuth();
  const [loading, setLoading] = useState(true);

  async function verifyAuthorization() {
    await getAccessToken();

    const token = sessionStorage.getItem("token");
    if(token) {
      storeToken(token, null)
    }
    setLoading(false)
  }

  useLayoutEffect(() => {
    verifyAuthorization()
  }, []);

  if(!accessToken && loading) {
    return <Loader loading={loading} />
  }

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;