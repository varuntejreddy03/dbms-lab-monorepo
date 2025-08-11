const pool = require('../config/db');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, roll_no, name FROM students ORDER BY roll_no');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllStudents };