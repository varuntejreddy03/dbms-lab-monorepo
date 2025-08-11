import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      login(username, password).finally(() => setLoading(false));
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 p-3" style={{ background: 'var(--background-start)' }}>
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div 
                  className="mx-auto d-flex align-items-center justify-content-center bg-primary-subtle rounded-circle" 
                  style={{ width: '80px', height: '80px' }}
                >
                  <span className="text-primary fw-bold fs-4">DBMS</span>
                </div>
                <h3 className="mt-3">Teacher Login</h3>
                <p className="text-muted">Lab Record Management System</p>
              </div>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading} size="lg">
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;