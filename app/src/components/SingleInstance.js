import React ,{useEffect,useState}from 'react';
import axios from 'axios';
import { Link ,useParams} from 'react-router-dom';
import {Container,Card} from 'react-bootstrap';
import REACT_API_BASE_URL from "../config.js";

const SingleInstance = () => {
  const [instance, setInstance] = useState([]);
  const { id } = useParams();
  useEffect(() => { 
    fetchInstance();
  }, []);

  const fetchInstance=async ()=>{
    try {
      const response = await axios.get(REACT_API_BASE_URL+`/instance/`+id, {
        headers: {
          Authorization: `Bearer `+localStorage.getItem('authToken') // Replace YOUR_ACCESS_TOKEN with your actual token
        },
      });
      //console.log(response.data);
      setInstance(response.data);

    } catch (error) {
      console.error(`Error fetching instances for instances`, error);
    }
  }

  return (
    <Container fluid>
      <Card className="mb-4">
      <Card.Header as="h5">{instance.application.name}</Card.Header>
      <Card.Body>
        
      </Card.Body>
    </Card>
    </Container>
  );
};

export default SingleInstance;
