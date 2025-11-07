import React, { useContext, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import AuthContext from '../helpers/context/AuthContext';
import logo2 from '../ssel.png';

function Topbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Track auth state
  }, [isAuthenticated, user]);

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    logout();
    navigate('/'); // Navigate to the login or home page after logout
  };

  
return (
    <Navbar expand="lg" className="topbar">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/dashboard" className="mx-auto mx-lg-0">
          <img
            src={logo2}
            alt="Smart IoT"
            width="300"
            height="85"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Navbar Toggle for Responsiveness */}
        {isAuthenticated && <Navbar.Toggle aria-controls="basic-navbar-nav" />}

        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  className="text-capitalize"
                >
                  {user?.fullName || user?.username || 'User'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/dashboard">
                      Home
                    </Dropdown.Item>
                    <Dropdown.Divider />
                {user && user._id ? (
                <Dropdown.Item as={Link} to={`/dashboard/profile/${user._id}`}>
                  Profile
                </Dropdown.Item>
              ) : null}
                <Dropdown.Divider />
                  {user?.role === 'admin' && (<div>
                    <Dropdown.Item as={Link} to="/dashboard/users">
                      User Management
                    </Dropdown.Item>
                    <Dropdown.Divider /></div>
                  )}                  
                  
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Topbar;
