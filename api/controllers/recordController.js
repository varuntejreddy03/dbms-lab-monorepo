const pool = require('../config/db');

const getAllExperiments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM experiments ORDER BY id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecordsByExperiment = async (req, res) => {
  try {
    const { experimentId } = req.params;
    const query = `
      SELECT s.id, s.roll_no, s.name, r.date_completed, r.notes
      FROM students s
      LEFT JOIN records r ON s.id = r.student_id AND r.experiment_id = ?
      ORDER BY s.roll_no;
    `;
    const [rows] = await pool.query(query, [experimentId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRecord = async (req, res) => {
  const { studentId, experimentId, dateCompleted, notes } = req.body;
  if (!studentId || !experimentId) {
    return res.status(400).json({ message: 'Student ID and Experiment ID are required' });
  }
  try {
    const query = `
      INSERT INTO records (student_id, experiment_id, date_completed, notes)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE date_completed = VALUES(date_completed), notes = VALUES(notes);
    `;
    await pool.query(query, [studentId, experimentId, dateCompleted || null, notes || null]);
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecordsByRollNo = async (req, res) => {
  const { rollNo } = req.params;
  try {
    const [studentRows] = await pool.query('SELECT name, roll_no FROM students WHERE roll_no = ?', [rollNo]);
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const student = studentRows[0];
    const recordsQuery = `
      SELECT e.name, r.date_completed, r.notes
      FROM experiments e
      LEFT JOIN (
        SELECT r.experiment_id, r.date_completed, r.notes
        FROM records r
        JOIN students s ON r.student_id = s.id
        WHERE s.roll_no = ?
      ) r ON e.id = r.experiment_id
      ORDER BY e.id;
    `;
    const [records] = await pool.query(recordsQuery, [rollNo]);
    res.json({ student, records });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRecord = async (req, res) => {
  const { studentId, experimentId } = req.body;
  if (!studentId || !experimentId) {
    return res.status(400).json({ message: 'Student ID and Experiment ID are required' });
  }
  try {
    await pool.query('DELETE FROM records WHERE student_id = ? AND experiment_id = ?', [studentId, experimentId]);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllExperiments,
  getRecordsByExperiment,
  updateRecord,
  getRecordsByRollNo,
  deleteRecord,
};