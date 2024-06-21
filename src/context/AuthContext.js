import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Clear token on app load
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserRole('');
    setUserId('');

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(true);
      setUserEmail(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
      setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      setUserId(decodedToken.UserId);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    setIsLoggedIn(true);
    setUserEmail(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
    setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    setUserId(decodedToken.UserId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserRole('');
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
