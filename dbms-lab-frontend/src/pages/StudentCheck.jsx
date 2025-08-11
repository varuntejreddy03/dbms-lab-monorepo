import React, { useState } from 'react';
import api from '../services/api';
import { Container, Card, Form, Button, InputGroup, Alert, Table, Spinner } from 'react-bootstrap';

function StudentCheck() {
  const [rollNo, setRollNo] = useState('');
  const [results, setResults] = useState(null); // Will now store { student: {}, records: [] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckStatus = (e) => {
    e.preventDefault();
    if (!rollNo) {
      setError('Please enter a roll number.');
      return;
    }
    setLoading(true);
    setError('');
    setResults(null);
    api.get(`/records/student/${rollNo}`)
      .then(res => {
        if (res.data && res.data.records) {
          setResults(res.data);
        } else {
          setError('No records found for this Roll Number.');
        }
      })
      .catch(err => {
        setError('No records found or an error occurred.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="w-100" style={{ maxWidth: '800px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Check Lab Record Status</h2>
          <Form onSubmit={handleCheckStatus}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                placeholder="Enter your Roll No"
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner as="span" size="sm" animation="border" /> : 'Check Status'}
              </Button>
            </InputGroup>
          </Form>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          {results && (
            <div className="mt-4">
              {/* Display student name and roll number here */}
              <h4>Results for: <span className="text-primary">{results.student.name}</span> ({results.student.roll_no})</h4>
              
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Experiment Name</th>
                    <th>Date Completed</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map over results.records instead of just results */}
                  {results.records.map((record, index) => (
                    <tr key={index} className={!record.date_completed ? 'table-danger' : 'table-success'}>
                      <td>{record.name}</td>
                      <td>{record.date_completed ? record.date_completed.split('T')[0] : 'Not Completed'}</td>
                      <td>{record.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default StudentCheck;