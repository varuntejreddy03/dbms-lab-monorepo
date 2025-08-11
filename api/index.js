// in api/index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recordRoutes = require('./routes/recordRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/records', recordRoutes);

app.get('/api', (req, res) => {
  res.send('DBMS Lab Record API is running...');
});

// Vercel handles starting the server, so we only need to export the app.
module.exports = app;