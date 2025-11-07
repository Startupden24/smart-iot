import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Container, Row, Col, Button,Card,Badge ,Form,ListGroup,Modal,Pagination,Spinner,Alert} from 'react-bootstrap';
import REACT_API_BASE_URL from "../config.js";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
 // Fetch users from API or server
  
const fetchUsers = async () => {
try {
  const response = await fetch(REACT_API_BASE_URL+'/users', {
    method: 'GET', // Specify GET method
    headers: {
      'Content-Type': 'application/json', // Adjust if necessary
      'Authorization': `Bearer `+localStorage.getItem('authToken')
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  setUsers(data.users); // Update the state with the fetched users
} catch (error) {
  console.error('Error fetching users:', error);
}
};

useEffect(() => {
  fetchUsers();
}, []);

const toggleAppStatus = async (app) => {
  const newStatus = app.status === "active" ? "stopped" : "active";

  // ✅ update UI immediately
  setUsers(prev =>
    prev.map(u => ({
      ...u,
      applications: u.applications?.map(a =>
        a._id === app._id ? { ...a, status: newStatus } : a
      )
    }))
  );

  // ✅ send to backend
  await fetch(REACT_API_BASE_URL + `/application/${app._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  // ✅ optional: refresh latest data
   fetchUsers();
};



  const handleDeleteUser = (userId) => {
    // Logic for deleting a user
    console.log(`Delete user with ID: ${userId}`);
    // Add API call to delete user
  };

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <Col md={12}>
          <Button as={Link} to="/dashboard/signup">Add New User</ Button>
        </Col>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Projects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <ul>
                  {user.applications?.map(app => (
        <tr key={app._id} className="bg-light">
          <td colSpan={3}>
            <strong>{app.name}</strong>
          </td>

          <td colSpan={2}>
            {/* Switch to toggle status */}
            <Form.Check
              type="switch"
              id={`switch-${app._id}`}
              label={app.status === "active" ? "Active" : "Stopped"}
              checked={app.status === "active"}  // MUST be boolean
              onChange={() => toggleAppStatus(app)}
            />

          </td>

          <td></td>
        </tr>
      ))}

              </ul>
            </td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
