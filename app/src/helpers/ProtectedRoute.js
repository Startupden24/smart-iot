import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './context/AuthContext'; // Assuming an AuthContext

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  //console.log(isAuthenticated);
  //return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;//
};

export default ProtectedRoute;
