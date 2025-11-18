import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth as authService, users } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await users.getMe();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, senha) => {
    const response = await authService.login(email, senha);
    localStorage.setItem('token', response.data.token);
    await loadUser();
    return response.data;
  };

  const register = async (dados) => {
    const response = await authService.register(dados);
    localStorage.setItem('token', response.data.token);
    await loadUser();
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
