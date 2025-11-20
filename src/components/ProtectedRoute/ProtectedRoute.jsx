import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
