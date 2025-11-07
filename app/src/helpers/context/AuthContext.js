import React, { createContext, useState, useEffect } from 'react';
import userService from '../../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      userService.verifyUser(token)
        .then(userData => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error('Error verifying user:', error);
          // Handle error, e.g., clear token and set isAuthenticated to false
        });
    }
  }, []);
  const login = async(token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    const userData = await userService.verifyUser(token);
    //console.log("user data"+userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
