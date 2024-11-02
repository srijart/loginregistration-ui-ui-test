// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithUserName } from '../../Services/courseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedStatus = localStorage.getItem('isLoggedIn');
    return storedStatus === 'true';
  });

  const login = async() => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
