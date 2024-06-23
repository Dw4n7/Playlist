import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Navbar.css'; // Importar el archivo CSS

const NavbarComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('http://127.0.0.1:8000/api/logout', {}, { withCredentials: true })
      .then(() => {
        setCurrentUser(null);
        navigate('/login');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          TheBad<span className="brand-color-play">Play</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {currentUser ? (
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
