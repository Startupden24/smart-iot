import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';
import REACT_API_BASE_URL from "../config.js";
import { ListGroup, Container, Row, Col, Navbar, Nav,Card,Button,Modal,Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faPlus, 
  faCaretDown ,
  faCaretUp,
  faShareFromSquare,
  faWindowMaximize
  } from '@fortawesome/free-solid-svg-icons';

const IotEditor = () => {
  const [instances, setInstances] = useState([]);
  const [applications, setApplications] = useState([]);
  const[showInstModal,setInstModal]=useState(false);
  const [newInstance,setNewInstance]=useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [switchStates, setSwitchStates] = useState({});
  const[showDelModal,setDelModal]=useState(false);
  
  const [currentInst,setCurrentInst]=useState(null);
  
  const [templates,setTemplates]=useState([]);
  

  const { id } = useParams();
  useEffect(() => {  
    fetchInstances();
  }, []);

  const fetchInstances=async()=>{
    try {
      const response = await axios.get(REACT_API_BASE_URL+`/instance`, {
        headers: {
          Authorization: `Bearer `+localStorage.getItem('authToken') // Replace YOUR_ACCESS_TOKEN with your actual token
        },
      });
      setInstances(response.data.data);
      const initialSwitchStates = response.data.data.reduce((acc, app) => {
      acc[app._id] = app.status === 'running'; // Set true if status is 'active'
      return acc;
    }, {});
        setSwitchStates(initialSwitchStates);

    } catch (error) {
      console.error(`Error fetching instances for instances`, error);
    }
  }
  const fetchApplications = async () => {
      try {
        const response = await axios.get(REACT_API_BASE_URL+'/application',{headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken')}});
        setApplications(response.data.data);
        
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

  const fetchTemplates=async()=>{
    const response=await axios.get(REACT_API_BASE_URL+`/templates`);
    setTemplates(response.data.temps);
  }
  const createInstance=async()=>{
    setNewInstance('');
    fetchApplications();
    fetchTemplates();
    setInstModal(true);

  }
  const handleSelectChange = (e) => {
    setSelectedAppId(e.target.value); // Update the selected application's ID
  };
  const handleSelectTemplate=(e)=>{
    setSelectedTemplateId(e.target.value)
  }

  const saveInstance=async()=>{
    await axios.post(REACT_API_BASE_URL+`/instance`, { instanceName: newInstance,app:selectedAppId,template:selectedTemplateId }, {
          headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken'), // Replace YOUR_ACCESS_TOKEN with your actual token
          },
        });
    fetchInstances();
    setInstModal(false);
  }
  const handleSwitchChange = async (event, instanceId) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [instanceId]: event.target.checked
    }));
    const response = await axios.put(REACT_API_BASE_URL+'/instance/status/'+instanceId,{status:event.target.checked},{headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken')}});
  };
  const handleDelClick=(app)=>{
    setCurrentInst(app);
    setDelModal(true)
  }
  const  delApp=async()=>{
    try {
        await axios.delete(REACT_API_BASE_URL+`/instance/${currentInst._id}`, {
          headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken'), // Replace YOUR_ACCESS_TOKEN with your actual token
          },
        });
        setCurrentInst(null);
    setDelModal(false)
    fetchInstances();
      }catch(error){
        console.log("error in deleting instance");
      }
  }

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Button className="float-right" onClick={()=>createInstance()}>Create New Instance </ Button>
        </Col>
        <Col md={12} className="mt-3">
        <Card>
          <Card.Body>
                <ListGroup>
                  {instances.map((instance, idx) => (
                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center p-2">
      <div className="d-flex align-items-center instance-name-container">
        <span className="instance-name">{instance.name}</span>
        <a href={instance.url} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faShareFromSquare} className="mx-2" title="Open Editor" />
        </a>
      </div>
      <div className="d-flex align-items-center instance-icons">
        <Form.Check
          key={instance._id} // Use a unique key for each element
          type="switch"
          id={`custom-switch-${idx}`}
          label=""
          title="Change Instance status"
          className="d-inline"
          checked={switchStates[instance._id] || false} // Use the state to determine checked status
          onChange={(event) => handleSwitchChange(event, instance._id)} // Pass the instance._id to the handler
        />
        {instance.deployed && (
          <FontAwesomeIcon icon={faWindowMaximize} className="mx-2" title="View Dashboard" />
        )}
        <Link to={`/dashboard/instance/${instance._id}`}>
          <FontAwesomeIcon icon={faEye} className="mx-2" title="View Editor" />
        </Link>
        <FontAwesomeIcon icon={faTrash} className="mx-2" title="Delete Instance" onClick={()=>handleDelClick(instance)} />
                        
      </div>
    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
           </Card>
        </Col>
      </Row>
      {/*Create new instance*/}
     <Modal show={showInstModal} onHide={() => setInstModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Instance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAppName">
              <Form.Label>Instance Name</Form.Label>
              <Form.Control
                type="text"
                value={newInstance}
                onChange={(e) => setNewInstance(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSelectApplication" className="mt-3">
            <Form.Label>Select Application</Form.Label>
            <Form.Select value={selectedAppId} onChange={handleSelectChange}>
              <option value="">Select an application</option>
              {applications.map((app) => (
                <option key={app._id} value={app._id}>
                  {app.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formSelectTemplate" className="mt-3">
            <Form.Label>Select Template</Form.Label>
            <Form.Select value={selectedTemplateId} onChange={handleSelectTemplate}>
              <option value="">Select a template</option>
              {templates.map((app) => (
                <option key={app._id} value={app._id}>
                  {app.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setInstModal(false)}>
            Cancel
          </Button>
          <Button variant="success"  onClick={saveInstance}>
            Create Instance
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for deleting instance */}
      <Modal show={showDelModal} onHide={() => setDelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Instance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Deleting an instance will delete all data related to instance and this is irreversible process.Are you sure want to proceed with deletion?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDelModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="danger" onClick={delApp}>
            Yes,Delete Instance
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Container>
  );
};

export default IotEditor;
