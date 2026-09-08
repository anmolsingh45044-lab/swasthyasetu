import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';

const RoleContext = createContext(null);

// This context only ever manages `activeMode` (patient/donor), a field
// that is completely separate from the DB-controlled `role` field.
// There is no function here that can set role to 'admin'.
export const RoleProvider = ({ children }) => {
  const { user, updateUserInPlace } = useAuth();

  const switchMode = async (mode) => {
    const { data } = await authService.switchMode(mode);
    updateUserInPlace(data.user);
    return data.user;
  };

  const value = {
    activeMode: user?.activeMode || 'patient',
    switchMode
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
};
