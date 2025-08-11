import React, { useState, useEffect, useCallback } from 'react';
import AppNavbar from '../components/Navbar';
import api from '../services/api';
import { Container, Form, Table, Button, Spinner, Alert, Card, Row, Col, InputGroup, ButtonGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';

function TeacherDashboard() {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState('');
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecords = useCallback(() => {
    if (!selectedExperiment) return;
    setLoading(true);
    api.get(`/records/experiment/${selectedExperiment}`)
      .then(res => {
        const formattedRecords = res.data.map(r => ({ ...r, date_completed: r.date_completed ? new Date(r.date_completed) : null }));
        setRecords(formattedRecords);
        setError('');
      })
      .catch(err => setError("Failed to fetch records."))
      .finally(() => setLoading(false));
  }, [selectedExperiment]);

  useEffect(() => {
    const results = records.filter(record =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(results);
  }, [searchTerm, records]);

  useEffect(() => {
    api.get('/records/experiments')
      .then(res => {
        setExperiments(res.data);
        if (res.data.length > 0) setSelectedExperiment(res.data[0].id);
      })
      .catch(err => setError("Failed to fetch experiments."));
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleRecordChange = (studentId, field, value) => {
    const newRecords = records.map(r => (r.id === studentId ? { ...r, [field]: value } : r));
    setRecords(newRecords);
  };

  const handleSave = (studentId) => {
    const record = records.find(r => r.id === studentId);
    if (!record?.date_completed) {
      alert('Please select a completion date.');
      return;
    }
    api.post('/records/update', {
      studentId: record.id,
      experimentId: selectedExperiment,
      dateCompleted: record.date_completed.toISOString().split('T')[0],
      notes: record.notes || '',
    })
    .then(() => alert(`Record for ${record.roll_no} saved!`))
    .catch(err => alert(`Failed to save record.`));
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      api.delete('/records/delete', { data: { studentId, experimentId: selectedExperiment } })
        .then(() => {
          alert('Record deleted successfully!');
          fetchRecords();
        })
        .catch(err => alert(`Failed to delete record.`));
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <div>
      <AppNavbar title="DBMS Lab Record System" />
      <Container className="py-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="mb-4">Teacher Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row className="g-3 align-items-center">
                <Col md={7}>
                  <Form.Group controlId="experimentSelect">
                    <Form.Label className="fw-bold">Experiment:</Form.Label>
                    <Form.Select value={selectedExperiment} onChange={e => setSelectedExperiment(e.target.value)}>
                      {experiments.map(exp => <option key={exp.id} value={exp.id}>{exp.name}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group controlId="searchStudent">
                    <Form.Label className="fw-bold">Search Student:</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Filter by name or roll no..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        <AnimatePresence>
          {loading ? ( <div className="text-center"><Spinner animation="border" /></div> ) : (
            <>
              {/* TABLE VIEW */}
              <motion.div className="d-none d-lg-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="shadow-sm">
                  <Table responsive striped bordered hover className="m-0 align-middle">
                    <thead className="table-dark">
                      <tr><th>Roll No</th><th>Student Name</th><th>Date Completed</th><th>Notes</th><th className="text-center">Action</th></tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map(record => (
                        <tr key={record.id} className={record.date_completed ? 'table-row-success' : 'table-row-danger'}>
                          <td>{record.roll_no}</td><td>{record.name}</td>
                          <td><DatePicker selected={record.date_completed} onChange={date => handleRecordChange(record.id, 'date_completed', date)} dateFormat="yyyy-MM-dd" className="form-control form-control-sm" placeholderText="Select date" isClearable/></td>
                          <td><Form.Control size="sm" type="text" placeholder="Add notes..." value={record.notes || ''} onChange={e => handleRecordChange(record.id, 'notes', e.target.value)} /></td>
                          <td className="text-center"><ButtonGroup><Button variant="dark" size="sm" onClick={() => handleSave(record.id)}>Save</Button>{record.date_completed && (<Button variant="outline-danger" size="sm" onClick={() => handleDelete(record.id)}>Delete</Button>)}</ButtonGroup></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </motion.div>

              {/* CARD VIEW */}
              <div className="d-lg-none">
                {filteredRecords.map((record, index) => (
                  <motion.div key={record.id} custom={index} initial="hidden" animate="visible" variants={cardVariants}>
                    <Card className={`student-record-card ${record.date_completed ? 'is-complete' : 'is-incomplete'}`}>
                      <Card.Header className="fw-bold d-flex justify-content-between"><span>{record.name}</span><span className="text-muted">{record.roll_no}</span></Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3"><Form.Label>Date Completed</Form.Label><DatePicker selected={record.date_completed} onChange={date => handleRecordChange(record.id, 'date_completed', date)} dateFormat="yyyy-MM-dd" className="form-control" placeholderText="Select date" isClearable/></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Notes</Form.Label><Form.Control as="textarea" rows={2} placeholder="Add notes..." value={record.notes || ''} onChange={e => handleRecordChange(record.id, 'notes', e.target.value)} /></Form.Group>
                        <ButtonGroup className="w-100"><Button variant="dark" onClick={() => handleSave(record.id)}>Save</Button>{record.date_completed && (<Button variant="outline-danger" onClick={() => handleDelete(record.id)}>Delete</Button>)}</ButtonGroup>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}

export default TeacherDashboard;