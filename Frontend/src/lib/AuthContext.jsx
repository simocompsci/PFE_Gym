// src/lib/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('user_type');
    
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
    
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email, password, userType) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
        user_type: userType
      });
      
      const { access_token, user, user_type } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_type', user_type);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setUserType(user_type);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user');
      setUser(null);
      setUserType(null);
    }
  };
  
  // Check if user has specific role
  const hasRole = (role) => userType === role;
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      userType, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: userType === 'admin',
      isCoach: userType === 'coach',
      isSecretary: userType === 'secretary',
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);