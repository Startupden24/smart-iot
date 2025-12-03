import React,{ useEffect, useState,useContext }  from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import REACT_API_BASE_URL from "../config.js";
import { Container, Row, Col, Button,Card,Badge ,Form,ListGroup,Modal,Pagination,Spinner,Alert} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, 
  faCaretDown ,
  faCaretUp,
  faShareFromSquare,
  faWindowMaximize,
  faUserPlus
  } from '@fortawesome/free-solid-svg-icons';
import AddClientModal from './AddClientModal';
import AuthContext from '../helpers/context/AuthContext';

const Applications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [switchStates, setSwitchStates] = useState({});
  const [instSwitchStates, setInstSwitchStates] = useState({});
  const [expandedAppId, setExpandedAppId] = useState(null);
  const [instances, setInstances] = useState(null);

  const [showClientModal, setClientModal] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [newAppName, setNewAppName] = useState("");

  const[showInstanceModal,setInstanceModal]=useState(false);
  const [newInstanceName,setNewInstanceName]=useState("");
  const [currentInstance, setCurrentInstance] = useState(null);
  
  const[showAppModal,setAppModal]=useState(false);
  const [newApp,setNewApp]=useState(null);

  const[showDelInstModal,setDelInstModal]=useState(false);
  const[showDelModal,setDelModal]=useState(false);
  const [newDelName,setNewDelName]=useState(null);

  const [templates,setTemplates]=useState([]);
  const [selectedTemplate,setSelectedTemplate]=useState('default');
  const [loading, setLoading] = useState(false);

  const [waitMessage, setWaitMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Fetch applications from the API
  useEffect(() => { 
  //console.log('Switch States Updated:', instSwitchStates);  
    if (user?.role === 'Client' && location.pathname !== '/client') {
      console.log("client login");
      navigate('/client');
    }else{
    fetchApplications();
  }
  }, [user, location, navigate]);
  const fetchApplications = async () => {
      try {
        const response = await axios.get(REACT_API_BASE_URL+'/application',{headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken')}});
        setApplications(response.data.data);
        const initialSwitchStates = response.data.data.reduce((acc, app) => {
      acc[app._id] = app.status === 'active'; // Set true if status is 'active'
      return acc;
    }, {});
        setSwitchStates(initialSwitchStates);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    const handleSwitchChange = async (event, appId) => {
  const newStatus = event.target.checked ? "active" : "stopped";

  // Update frontend UI immediately
  setApplications(prev =>
    prev.map(app =>
      app._id === appId ? { ...app, status: newStatus } : app
    )
  );

  try {
    // Send to backend
    await axios.put(
      `${REACT_API_BASE_URL}/application/status/${appId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      }
    );

  } catch (error) {
    console.error("Failed to update application:", error);
  }
};

  
 /* const handleSwitchChange = async (event, appId) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [appId]: event.target.checked
    }));
    const response = await axios.put(REACT_API_BASE_URL+'/application/status/'+appId,
        {status:event.target.checked},
        {headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken')}});
  };*/
  /*const handleSwitchInstChange = async (event, appId) => {
    console.log("before:"+event.target.checked);
    const response = await axios.put(REACT_API_BASE_URL+'/instance/status/'+appId,{status:event.target.checked},{headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken')}});
    if(response.data.success){
      console.log("after:"+event.target.checked);
      setInstSwitchStates((prevStates) => ({
      ...prevStates,
      [appId]: event.target.checked
    })); 
    }else{
      alert(response.data.message)
    }
  };*/
const handleSwitchInstChange = async (event, instanceId) => {
  const newStatus = event.target.checked ? "running" : "stopped";

  try {
    const res = await axios.put(
      `${REACT_API_BASE_URL}/instance/status/${instanceId}`,
      { status: event.target.checked },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!res.data.success) {
      alert(res.data.message);
      return;
    }

    // 🔥 Update React state immediately (this is what fixes your UI)
    setInstances((prev) =>
      prev.map((inst) =>
        inst._id === instanceId ? { ...inst, status: newStatus } : inst
      )
    );
    fetchApplications();
  } catch (err) {
    console.error(err);
  }
};


  const fetchInstances = async (appId) => {
    //console.log(appId);
    try {
      const response = await axios.get(REACT_API_BASE_URL+`/instance?appId=`+appId, {
        headers: {
          Authorization: `Bearer `+localStorage.getItem('authToken') // Replace YOUR_ACCESS_TOKEN with your actual token
        },
      });
      setInstances(response.data.data);
      const initialInstSwitchStates = response.data.data.reduce((acc, app) => {
      acc[app._id] = app.status === 'running'; 
      return acc;
    }, {});
      setInstSwitchStates(initialInstSwitchStates);
    } catch (error) {
      console.error(`Error fetching instances for appId ${appId}:`, error);
    }
  };
  const toggleInstances = (appId) => {
    //console.log(expandedAppId);
    setInstances(null)
    if (expandedAppId === appId) {
      setExpandedAppId(null);
    } else {
      setExpandedAppId(appId)
      fetchInstances(appId);
    }
  };
  const handleEditClick = (app) => {
    setCurrentApp(app);
    setNewAppName(app.name);
    setShowModal(true);
  };
  const handleAddClick = (app) => {
    //console.log(app);
    setCurrentApp(app);
    fetchTemplates();
    setNewInstanceName('');
    setInstanceModal(true);
  };

  const handleDelClick=(app)=>{
    setCurrentApp(app);
    setDelModal(true)
  }
  const handleDelInstClick=(app)=>{
    setCurrentInstance(app);
    setDelInstModal(true)
  }

  
  const saveInstance=async()=>{
   setWaitMessage(true);
    //console.log(newInstanceName);
    try {
    // Make the API call to save the instance
      const Temp=(selectedTemplate=='')?'default':selectedTemplate;
    const response= await axios.post(REACT_API_BASE_URL + `/instance`, {
        instanceName: newInstanceName,
        app: currentApp._id,
        template: Temp
      }, {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem('authToken'),
        },
      });
    if(response.data.success){
        setWaitMessage(false);
        alert("Instance saved successfully.");
        fetchInstances(currentApp._id);
        setInstanceModal(false);
    }else{
      setWaitMessage(false);
      setInstanceModal(false);
      setErrorMessage(response.data.message);
      setTimeout(() => {
      setErrorMessage(false);
    }, 5000);
    }

    // Fetch instances and close the modal upon success
    
  } catch (error) {
    setWaitMessage(false);
    console.error("Error saving instance:", error);
    setErrorMessage(error.response.data.message)
    setTimeout(() => {
      setErrorMessage(false);
    }, 5000);
  }finally {
      setWaitMessage(false); // Always set loading to false when API call ends (success or failure)
    }

  }

  const  delApp=async()=>{
    try {
        await axios.delete(REACT_API_BASE_URL+`/application/${currentApp._id}`, {
          headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken'), // Replace YOUR_ACCESS_TOKEN with your actual token
          },
        });
        setCurrentApp(null);
    setDelModal(false)
    fetchApplications();
      }catch(error){
        console.log("error in deleting application");
      }
  }
  const  delInst=async()=>{
    console.log(currentInstance);
    try {
        await axios.delete(REACT_API_BASE_URL+`/instance/${currentInstance._id}`, {
          headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken'), // Replace YOUR_ACCESS_TOKEN with your actual token
          },
        });
        fetchInstances(currentInstance.application);
        setDelInstModal(false);
        setCurrentInstance(null)
      }catch(error){
        console.log("error in deleting instance");
      }
  }

  const saveAppName = async (event) => {
    event.preventDefault();
    //setWaitMessage(true);
    if (currentApp && newAppName) {
      try {
        const response=await axios.put(REACT_API_BASE_URL+`/application/${currentApp._id}`, { name: newAppName }, {
          headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken'), // Replace YOUR_ACCESS_TOKEN with your actual token
          },
        });
        // Update the application's name locally
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === currentApp._id ? { ...app, name: newAppName } : app
          )
        );
        //setWaitMessage(false);

        setShowModal(false);
        fetchApplications();
      } catch (error) {
        console.error('Error updating application name:', error);
      }
    }
   // setWaitMessage(false);
  };

  const createApp=async()=>{
    setAppModal(true);
    fetchTemplates();
    setNewApp(null);
  }

  const fetchTemplates=async()=>{
    const response=await axios.get(REACT_API_BASE_URL+`/templates`);
    setTemplates(response.data.temps);
  }

  const saveApp=async()=>{
    if (newApp) {
      setWaitMessage(true);
      try {
        //console.log(selectedTemplate);
        const Template=(selectedTemplate=={})?'default':selectedTemplate;
        //console.log(Template);
        const response=await axios.post(REACT_API_BASE_URL+`/application`, { name: newApp,instance:newInstanceName,template:Template }, {
          headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken'), // Replace YOUR_ACCESS_TOKEN with your actual token
          },
        });
        if(response&&response.data.success){
          if(response.error){
            console.log("error in instance");
            setErrorMessage("Application created successfully but not the instance.Only 2 running instances can be created.")
            fetchApplications();
          }
          setWaitMessage(false);
          fetchApplications();        
          setAppModal(false);
        }else{
          setWaitMessage(false);
          setErrorMessage(response.data.message)
          setTimeout(() => {
            
          setErrorMessage(false);
        }, 5000);
            }
        
      } catch (error) {
        console.error('Error updating application name:', error);
        setWaitMessage(false);
          setErrorMessage(error.response.data.message)
          setTimeout(() => {
            
          setErrorMessage(false);
            }, 5000);
          
      }
    }

  }

  const handleSelectTemplate=async(e)=>{
    //console.log(e);
    //const val=(e.target.value!=={})?e.target.value:'default';
      setSelectedTemplate(e.target.value);
    
  }

  const handleClientModal = () => setClientModal(true);
  const closeClientModal = () => setClientModal(false);

  const handleSaveClient = async (client) => {
    try {
        var clientResp=await axios.post(REACT_API_BASE_URL+`/client`, client, {
          headers: {
            Authorization: `Bearer `+localStorage.getItem('authToken'), // Replace YOUR_ACCESS_TOKEN with your actual token
          },
        }); 
        alert(clientResp.data.success);
        //setErrorMessage(clientResp)       
        setClientModal(false);

      } catch (error) {
        alert(error.response.data.message)
        console.error('Error adding client:', error.response.data.message);
      }

  };
  
  return (
    <Container fluid>
      <Row>
        <Col md={12} className="d-flex justify-content-between align-items-center mb-3">
        <Button onClick={() => createApp()}>Create New Application</Button>

        {/* New User Projects Button */}
        <Button variant="info" onClick={() => {
          console.log("clicked");
          navigate("/dashboard/user-projects");
        }}>
          User Projects
        </Button>
      </Col>

        <Col md={12} className="mt-3">
          <Row>
            {applications.map((app, index) => (
              <Col md={12} key={index} className="mb-3">
                <Card>
                  <Card.Body className='row'>
                    <Card.Title className="col-9" onClick={() => toggleInstances(app._id)}>{app.name} <Badge bg={app.status === "stopped" ? "danger" : "success"}>
  {app.status === "stopped" ? "Inactive" : app.status}
</Badge>

                    {expandedAppId === app._id && (
                    <FontAwesomeIcon icon={faCaretUp} className="mx-2" title="Collapse" />)
                    } 
                    {expandedAppId !== app._id && (
                    <FontAwesomeIcon icon={faCaretDown} className="mx-2" title="Expand" />)
                    }    
                      </Card.Title>                      
                      <span className="col-3 text-end">
                          <FontAwesomeIcon icon={faEdit} className="mx-2" title="Edit Application" onClick={() => handleEditClick(app)} />
                       
                        <FontAwesomeIcon icon={faPlus} className="mx-2 app-icons" title="Add Instance" onClick={()=>handleAddClick(app)}/>
                        <FontAwesomeIcon icon={faTrash} className="mx-2 app-icons" title="Delete Application" onClick={()=>handleDelClick(app)} />
                        <FontAwesomeIcon icon={faUserPlus} className="mx-2 app-icons" title="Add Client" onClick={handleClientModal} />
        
                        
                      </span>
                  </Card.Body>

                  {expandedAppId === app._id && instances && (
                    <Card.Body>
                      <ListGroup>
                          {instances.map((instance, idx) => (
                            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                              <div>
                                {instance.name}
                                <a href={instance.url} target="_blank" rel="noopener noreferrer">
                                  <FontAwesomeIcon icon={faShareFromSquare} className="mx-2 app-icons" title="Open Editor" style={{ color: '#195557' }} />
                                </a>
                                <a href={instance.dashboardUrl} target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faWindowMaximize} className="mx-2 app-icons" title="View Dashboard" style={{ color: '#195557' }} />

                              </a>

                              </div>
                              MQTT URL:{instance.mqttPort}
                              <span>
                                    <FontAwesomeIcon icon={faTrash} className="mx-2" title="Delete Instance" onClick={()=>handleDelInstClick(instance)} />
                        
                             {/* <span className="instance-switch"><Form.Check
                                key={instance._id} // Use a unique key for each element
                                type="switch"
                                id={`custom-switch switch-${instance._id}`}
                                label=""
                                title="Change Instance status"
                                className="d-inline"
                                checked={instSwitchStates[instance._id] || false} // Use the state to determine checked status
                                onChange={(event) => handleSwitchInstChange(event, instance._id)} // Pass the app._id to the handler
                              /> </span> */}
                              <span className="instance-switch">
  <Form.Check
    key={instance._id}
    type="switch"
    id={`custom-switch switch-${instance._id}`}
    label=""
    title="Change Instance status"
    className="d-inline"
    checked={instance.status === "running"}   // <-- FIXED
    onChange={(event) =>
      handleSwitchInstChange(event, instance._id)
    }
  />
</span>

                        </span>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                    

                    </Card.Body>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      {/* Modal for editing application name */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Application Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveAppName}>
            <Form.Group controlId="formAppName">
              <Form.Label>Application Name</Form.Label>
              <Form.Control
                type="text"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveAppName}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for adding instance */}
      <Modal show={showInstanceModal} onHide={() => setInstanceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Editor/Instance to Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {errorMessage&&(<Alert variant="danger">{errorMessage}</Alert>)}
            {waitMessage && (
        <div className="d-flex align-items-center">
          <Spinner animation="border" role="status" className="me-2">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <span>It will take some moments to prepare an instance.</span>
        </div>
      )}
          <Form>
            <Form.Group controlId="formAppName">
              <Form.Label>Instance Name</Form.Label>
              <Form.Control
                type="text"
                value={newInstanceName}
                onChange={(e) => setNewInstanceName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSelectTemplate" className="mt-3">
            <Form.Label>Select Template </Form.Label>
            <Form.Select value={selectedTemplate} onChange={handleSelectTemplate}>
              <option value="">Select a template</option>
              {templates.map((app) => (
                <option key={app._id} value={app.name}>
                  {app.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setInstanceModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveInstance} disabled={loading}>
            Save Instance
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Add Client Modal*/}
      <AddClientModal show={showClientModal} handleClose={closeClientModal} handleSave={handleSaveClient} />

      {/* Modal for deleting application */}
      <Modal show={showDelModal} onHide={() => setDelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Deleting an application will delete all instances in it and this is irreversible process.Are you sure want to proceed with deletion?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDelModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="danger" onClick={delApp}>
            Yes,Delete application
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for deleting instance */}
      <Modal show={showDelInstModal} onHide={() => setDelInstModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Instance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Deleting an instance will delete all configurations related to instance.This is irreversible process.Are you sure want to proceed with deletion?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDelInstModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="danger" onClick={delInst}>
            Yes,Delete Instance
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for creating application */}
      <Modal show={showAppModal} onHide={() => setAppModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {errorMessage && (<Alert variant='danger'>{errorMessage}</Alert>)}
        {waitMessage && (
        <div className="d-flex align-items-center">
          <Spinner animation="border" role="status" className="me-2">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <span>It will take some moments to prepare an instance.</span>
        </div>
      )}
          <Form>
            <Form.Group controlId="formAppName">
              <Form.Label>Application Name</Form.Label>
              <Form.Control
                type="text"
                value={newApp || ""}
                onChange={(e) => setNewApp(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formInstanceName">
              <Form.Label>Default Instance Name</Form.Label>
              <Form.Control
                type="text"
                value={newInstanceName||""}
                onChange={(e) => setNewInstanceName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSelectTemplate" className="mt-3">
            <Form.Label>Select Template for default instance</Form.Label>
            <Form.Select value={selectedTemplate} onChange={handleSelectTemplate}>
              <option value="">Select a template</option>
              {templates.map((app) => (
                <option key={app._id} value={app.name}>
                  {app.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAppModal(false)}>
            Cancel
          </Button>
          <Button variant="success"  onClick={saveApp}>
            Create Application
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Applications;
