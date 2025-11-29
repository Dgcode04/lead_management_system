import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LoginContainer from '../../containers/LoginContainer/LoginContainer';

const Login = () => {
  const { isAuthenticated, user } = useAppContext();

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (user?.role === 'Admin') {
      return <Navigate to="/" replace />;
    } else if (user?.role === 'Telecaller') {
      return <Navigate to="/telecaller" replace />;
    }
  }

  return <LoginContainer />;
};

export default Login;

