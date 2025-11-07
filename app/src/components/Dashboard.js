import React, { useState,useContext,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,Outlet,useNavigate,useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Applications from './Applications'
import SingleApplication from './SingleApp';
import SingleInstance from './SingleInstance';
import IotEditor from './IotEditor'
import Devices from './Devices'
import Signup from './Signup';
import Team from './Team'
import Activity from './Activity'
import Profile from './Profile';
import UserManagement from './UserManagement';
import Footer from './footer';
import { Container, Row, Col,Button } from 'react-bootstrap';
import AuthContext from '../helpers/context/AuthContext';
import UserApplications from './UserApplications';


const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  useEffect(() => {
    // Only navigate if the user is a client and we are not already on the '/client' route
    if (user?.role === 'Client' && location.pathname !== '/client') {
      console.log("client login");
      navigate('/client');
    }
  }, [user, location, navigate]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
    <Topbar />
      <Row className="m-4 main">
             
        <Col md={10} className="p-4 flex-grow-1">
          
          <Routes>
            <Route path="/" element={<Applications />} />            
            <Route path="/application/:id" element={<SingleApplication />} />
            <Route path="/instance/:id" element={<SingleInstance />} />
            <Route path="/iot_instances" element={<IotEditor />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/user-projects" element={<UserApplications />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />        
            <Route path="/devices" element={<Devices />} />
            <Route path="/team" element={<Team />} />
            <Route path="/activity" element={<Activity />} />
            </Routes>
            <Outlet />
        </Col>
      </Row>
      <Footer />
     </div>
  );
};

export default Dashboard;
