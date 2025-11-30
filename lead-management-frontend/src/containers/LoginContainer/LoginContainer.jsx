import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/common/LoginForm/LoginForm';
import { useAppContext } from '../../context/AppContext';
import { useSigninMutation } from '../../store/api/authapi';

// Normalize role to match expected format (Admin or Telecaller)
const normalizeRole = (role) => {
  if (!role) return 'User';
  
  const roleLower = role.toString().toLowerCase().trim();
  
  // Map various role formats to standard format
  if (roleLower === 'admin') {
    return 'Admin';
  }
  if (roleLower === 'telecaller') {
    return 'Telecaller';
  }
  if (roleLower === 'user' || roleLower === 'normal user') {
    return 'Telecaller'; // Default users to Telecaller role
  }
  
  // If role doesn't match, capitalize first letter of each word
  return role
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const LoginContainer = () => {
  const { setUser, setIsAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [signin, { isLoading: isSigningIn }] = useSigninMutation();

  const handleLogin = async (email, password) => {
    try {
      // Call signin API
      const response = await signin({ email, password }).unwrap();

      // Extract user data from API response
      // Handle different response formats
      const userData = response?.user || response?.data || response;
      const token = response?.token || response?.access_token || response?.accessToken;

      // Store token if provided
      if (token) {
        localStorage.setItem('token', token);
      }

      // Extract and normalize role from API response
      const rawRole = userData?.role;
      const normalizedRole = normalizeRole(rawRole);

      // Prepare user data for context
      const userInfo = {
        name: userData?.name || userData?.username || email.split('@')[0],
        initials: (userData?.name || email.split('@')[0])
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        email: userData?.email || email,
        role: normalizedRole, // Use normalized role
        id: userData?.id || userData?.user_id || userData?._id,
      };

      // Update context
      setUser(userInfo);
      setIsAuthenticated(true);

      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('isAuthenticated', 'true');

      // Redirect based on normalized role
      if (normalizedRole === 'Admin') {
        navigate('/', { replace: true });
      } else if (normalizedRole === 'Telecaller') {
        navigate('/telecaller', { replace: true });
      } else {
        // Default to admin dashboard for unknown roles
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle different error formats
      const errorMessage = 
        error?.data?.message || 
        error?.data?.error || 
        error?.message ||
        'Invalid email or password. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDemoLogin = (email, password) => {
    handleLogin(email, password);
  };

  return <LoginForm onLogin={handleLogin} onDemoLogin={handleDemoLogin} loading={isSigningIn} />;
};

export default LoginContainer;

