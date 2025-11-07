import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FormGroup, FormCheck,Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import Topbar from "./Topbar";
import logo from "../logo512-ssel.png";
import Footer from './footer';
function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    fullName:'',
    email: '',
    password: '',
    confirmPassword: '',
    purpose: {
      personal: false,
      business: false,
      education: false,
    },
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'password') {
      const error = validatePassword(value);
      setValidationErrors({ ...validationErrors, password: error });
    }
    //console.log(formData);
  };
  const validatePassword = (password) => {
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!uppercase.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!lowercase.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!specialChar.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return ''; // No errors
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm(); // Perform form validation
    setValidationErrors(errors); // Update validation errors state
    //console.log(errors);
    if (Object.keys(errors).length === 0) {
      // Handle successful form submission (e.g., API call, redirect)
      try {
        const response = await userService.signup(formData);
        //console.log('Signup successful:', response);
        setErrorMessage(false)
        alert('Registered successfully. Please login to continue.');
        // Optionally, redirect after a delay
        setTimeout(() => {
          navigate('/dashboard/users'); // Replace '/login' with your desired path
        }, 2000); // Redirect after 2 seconds
      } catch (error) {
        console.error('Signup error:', error.response.data.message);
        alert(error.response.data.message);
        setTimeout(() => {
          setErrorMessage(false);
        }, 3000);
      }
    }
  };

  const validateForm = () => {
      const errors = {};
      if (!formData.username) {
        errors.username = 'Username is required';
      }
      if (!formData.fullName) {
        errors.fullName = 'Full Name is required';
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.password || formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.purpose)  
     {
          errors.purpose = 'Please select a purpose';
        }
      return errors;
    };

  return (
    <div className="main">
    
      <Row className="justify-content-center m-4">
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      
        <Col md={6} className="card">
          <div className="text-center mb-4">
            <h2>Signup </h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="formBasicFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Full name" name="fullName" value={formData.fullName} onChange={handleChange}   
 isInvalid={validationErrors.fullName} />
              <Form.Control.Feedback type="invalid">{validationErrors.fullName}</Form.Control.Feedback>
            </FormGroup> 

            <FormGroup controlId="formBasicUsername" className="mt-4">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" name="username" value={formData.username} onChange={handleChange}   
 isInvalid={validationErrors.username} />
              <Form.Control.Feedback type="invalid">{validationErrors.username}</Form.Control.Feedback>
            </FormGroup>   


            <FormGroup controlId="formBasicEmail" className="mt-2">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email"   
 value={formData.email} onChange={handleChange} isInvalid={validationErrors.email} />
              <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>   

            </FormGroup>

            <FormGroup controlId="formBasicPassword" className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password"   
 value={formData.password} onChange={handleChange} isInvalid={validationErrors.password} />
              <Form.Control.Feedback type="invalid">{validationErrors.password}</Form.Control.Feedback>
            </FormGroup>   


            <FormGroup controlId="formBasicConfirmPassword" className="mt-2">
              <Form.Label>Re-enter Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}   
 isInvalid={validationErrors.confirmPassword} />
              <Form.Control.Feedback type="invalid">{validationErrors.confirmPassword}</Form.Control.Feedback>   

            </FormGroup>

            <FormGroup controlId="formBasicPurpose" isInvalid={!!validationErrors.purpose} className="mt-2" >
              <Form.Label>Purpose of using Smart IoT</Form.Label>
              <FormCheck
                type="radio"
                label="Personal"
                name="purpose"
                value="Personal"
                checked={formData.purpose === 'Personal'}
                onChange={handleChange}
              />
              <FormCheck
                type="radio"
                label="Business"
                name="purpose"
                value="Business"
                checked={formData.purpose === 'Business'}
                onChange={handleChange}
              />
              <FormCheck
                type="radio"
                label="Education"
                name="purpose"
                value="Education"
                checked={formData.purpose === 'Education'}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.purpose}</Form.Control.Feedback>
            </FormGroup>

            <Button variant="primary" type="submit" className="w-100 mt-4 mb-4">
              Signup
            </Button>
          </Form>
          {/*<div className="text-center mt-3">
            <p>Already have an account? <Link to="/">Login</Link></p>
          </div>*/}
        </Col>
      </Row>
      
    </div>
  );
}

export default Signup;
