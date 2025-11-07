import React, { useState ,useContext} from 'react';
import { Container, Form, Button,Row, Col,Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../ssel.png";
import userService from '../services/userService';
import AuthContext from '../helpers/context/AuthContext'; 

function Login() {
  const [validationErrors, setValidationErrors] = useState({});
  const { isAuthenticated,login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(); // Perform form validation
    setValidationErrors(errors); // Update validation errors state
    if (Object.keys(errors).length === 0) {
      try {
        const response = await userService.login(formData);
        if(response.user&&response.user.role=='Client'){
          const instanceUrl = response.user.clientInstance;
           window.location.href=instanceUrl;
        }else{
        const token = response.tokenname;
        await login(token);
        navigate('/dashboard'); // Replace '/login' with your desired path
      }
      } catch (error) {
        console.error('Login error:', error);
        setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage(false);
        }, 3000);
      }
    }
  };
  const validateForm = () => {
      const errors = {};
      if (!formData.email ) {
        errors.email = 'Email/Username is required';
      }
      if (!formData.password ) {
        errors.password = 'Password is required';
      }      
      return errors;
    };


  return (
    <Container className="mt-5 main">
      <Row className="justify-content-center p-2">
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Col md={6} className="card">
          <div className="text-center mb-4">
            <h2>Login</h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail"> {/* Add mb-3 for spacing */}
              <Form.Label>Username or Email address</Form.Label>
              <Form.Control type="text" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} isInvalid={validationErrors.email}  />
            <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>   

            </Form.Group>

            <Form.Group controlId="formBasicPassword" >
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} isInvalid={validationErrors.password} />
            <Form.Control.Feedback type="invalid">{validationErrors.password}</Form.Control.Feedback>   

            </Form.Group>

            <Button variant="default" type="submit" className="w-100 mb-4">
              Submit
            </Button>
          </Form>          
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
