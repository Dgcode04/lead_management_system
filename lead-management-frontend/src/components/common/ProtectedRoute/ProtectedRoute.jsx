import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'Admin') {
      return <Navigate to="/" replace />;
    } else if (user?.role === 'Telecaller') {
      return <Navigate to="/telecaller" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

