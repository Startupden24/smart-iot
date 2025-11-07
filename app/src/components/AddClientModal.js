import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

//const AddClientModal = ({ show, handleClose, handleSave }) => {
function AddClientModal({ show, handleClose, handleSave }) {
  const [clientName, setClientName] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [instanceUrl, setInstanceUrl] = useState('');

  
  const handleNameChange = (event) => {
    setClientName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setClientPassword(event.target.value);
  };

  const handleUrlChange = (event) => {
    setInstanceUrl(event.target.value);
  };

  const handleSaveClick = () => {
    handleSave({clientName, clientPassword, instanceUrl});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formClientName">
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={handleNameChange}
            />
          </Form.Group>
          <Form.Group controlId="formClientPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={clientPassword}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Form.Group controlId="formInstanceUrl">
            <Form.Label>Instance URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter instance URL"
              value={instanceUrl}
              onChange={handleUrlChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddClientModal;
