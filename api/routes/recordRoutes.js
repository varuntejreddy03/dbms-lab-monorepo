const express = require('express');
const router = express.Router();
const {
  getAllExperiments,
  getRecordsByExperiment,
  deleteRecord,
  updateRecord,
  getRecordsByRollNo,
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

// Protected Routes (Teacher only)
router.get('/experiments', protect, getAllExperiments);
router.get('/experiment/:experimentId', protect, getRecordsByExperiment);
router.delete('/delete', protect, deleteRecord);
router.post('/update', protect, updateRecord);

// Public Route (For student check view)
router.get('/student/:rollNo', getRecordsByRollNo);

module.exports = router;