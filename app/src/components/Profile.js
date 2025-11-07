import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap CSS
import REACT_API_BASE_URL from "../config.js";
const EditProfile = ({ userId }) => {
  // States for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();

  // Effect to load user data (mock fetch for user details)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(REACT_API_BASE_URL+`/users/${id}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json', // Adjust if necessary
      'Authorization': `Bearer `+localStorage.getItem('authToken')
    },
  });  // Replace with your API endpoint
        const data = await response.json();
        setName(data.fullName);
        setUsername(data.username);
        setEmail(data.email);
      } catch (err) {
        setError('Failed to load user data');
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    console.log("updating profile");
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError('');

    const updatedProfile = { name, email, password,currentPassword };

    try {
      const response = await fetch(REACT_API_BASE_URL+`/users/${id}`, {
        method: 'PUT', // Assuming PUT for updating data
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer `+localStorage.getItem('authToken'),
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error("Something went wrong.Try again");
      }

      const result = await response.json();
      if (!result.status) {
        throw new Error(result.message);
      }else{
      alert('Profile updated successfully!');
    }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
        </div>
        <div className="mb-3">
        <label htmlFor="currentPassword" className="form-label">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          className="form-control"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required 
        />
      </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 text-center">
          <button
            type="submit"
            className="btn btn-primary w-100"
            onClick={(e) => e.stopPropagation()}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
