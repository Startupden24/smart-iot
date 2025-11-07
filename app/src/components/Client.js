import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col,Button } from 'react-bootstrap';
import AuthContext from '../helpers/context/AuthContext';
import Topbar from './Topbar';

const Client = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [instanceURL, setInstanceURL] = useState('');

  useEffect(() => {
    if (user?.clientInstance) {
      setInstanceURL(user.clientInstance);
    }
  }, [user?.clientInstance]); // Only run this effect when user.clientInstance changes


  const openDashboard= () => {
    console.log(instanceURL);
    window.open(instanceURL,'_blank')
  };

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}> 
      <Topbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Button variant="secondary" className="btn-lg" onClick={() => openDashboard()}>
      Launch Device Dashboard
    </Button>
  </div>
          
    </div>
  );
};

export default Client;
