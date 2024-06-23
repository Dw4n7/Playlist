// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './styles.css';

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/login/', { username, password }, { withCredentials: true })
      .then(response => {
        setCurrentUser(response.data.username);
        navigate('/');
      })
      .catch(error => {
        console.error('Login error:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Login</h2>
          <Form onSubmit={handleSubmit} className="card p-4">
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100">Login</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
