const express = require('express');
const router = express.Router();
const { getAllStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllStudents);

module.exports = router;