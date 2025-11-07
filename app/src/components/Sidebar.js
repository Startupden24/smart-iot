import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Navbar, Nav } from 'react-bootstrap';


const Sidebar = () => {
  return (
    <Container fluid>
      <Row>
        <Col className="d-flex flex-column align-items-start sidebar">
          <Navbar className="mt-4 w-100">
            <Nav className="flex-column w-100">
              <Nav.Link as={Link} to="/dashboard" className={({isActive}) => (isActive ? "nav-link p-2 active" : "nav-link p-2")}>
                Applications
              </Nav.Link>
              {/*<Nav.Link as={Link} to="/dashboard/iot_instances" className={({isActive}) => (isActive ? "nav-link p-2 active" : "nav-link p-2")}>
                Instances
              </Nav.Link>*/}
              <Nav.Link as={Link} to="/dashboard/devices" className={({isActive}) => (isActive ? "nav-link p-2 active" : "nav-link p-2")}>
                Devices
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/team" className={({isActive}) => (isActive ? "nav-link p-2 active" : "nav-link p-2")}>
                Team Management
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/activity-log" className={({isActive}) => (isActive ? "nav-link p-2 active" : "nav-link p-2")}> Activity Log
              </Nav.Link>
            </Nav>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
};

export default Sidebar;
