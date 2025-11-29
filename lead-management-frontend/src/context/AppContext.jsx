import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Check localStorage for existing session
  const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const getStoredAuth = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  };

  const [user, setUser] = useState(getStoredUser() || {
    name: '',
    initials: '',
    role: '',
    email: '',
  });

  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth());

  // Update localStorage when user or auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }, [user, isAuthenticated]);

  const logout = () => {
    setUser({
      name: '',
      initials: '',
      role: '',
      email: '',
    });
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

