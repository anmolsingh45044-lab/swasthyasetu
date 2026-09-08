import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ss_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const persist = (nextUser, token) => {
    if (token) localStorage.setItem('ss_token', token);
    localStorage.setItem('ss_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem('ss_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.getMe();
      persist(data.user);
    } catch (err) {
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    persist(data.user, data.token);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    persist(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    setUser(null);
  };

  const updateUserInPlace = (nextUser) => {
    persist(nextUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    // isAdmin is read straight from the DB-sourced user object - the
    // frontend never derives or overrides this itself.
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshMe,
    updateUserInPlace
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
