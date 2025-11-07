import React, { useContext, useState, useEffect } from 'react';
import Topbar from './Topbar';
import { BrowserRouter as Router, Routes, Route,Navigate ,Link, useNavigate} from 'react-router-dom';
import ProtectedRoute from '../helpers/ProtectedRoute';
import Login from './Login';
import Dashboard from './Dashboard';
import Footer from './footer';
import AuthContext from './../helpers/context/AuthContext';
import { Spinner } from 'react-bootstrap';


 function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
    useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');   

    }
  }, [isAuthenticated]);

  return (
    <div>
      <Topbar />
      <Login />
      <Footer />
    </div>
  );
};
export default Home;
