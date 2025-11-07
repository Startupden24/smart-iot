import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={6}>
            <p>© {new Date().getFullYear()} smartiotcloud. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            A Product By Smart Systems Engineering Lab
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
