import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, app considers user logged in
    setToken(localStorage.getItem('token'));
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.token) {
        const new_token = response.data.token;
        setToken(new_token);
        localStorage.setItem('token', new_token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login Failed: Invalid username or password.');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};