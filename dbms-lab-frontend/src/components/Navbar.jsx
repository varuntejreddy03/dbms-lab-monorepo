import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar, Container, Button } from 'react-bootstrap';

function AppNavbar({ title }) { // Renamed to avoid conflict with react-bootstrap's Navbar
  const { logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/dashboard" className="fw-bold text-primary">
          {title}
        </Navbar.Brand>
        <Button variant="outline-danger" size="sm" onClick={logout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;