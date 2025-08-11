const mysql = require('mysql2/promise');
require('dotenv').config();



const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // <-- ADD THIS LINE
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ... rest of the file is the same

pool.getConnection()
  .then(connection => {
    console.log('MySQL Database connected successfully!');
    connection.release();
  })
  .catch(error => {
    console.error('Error connecting to MySQL Database:', error.message);
  });

module.exports = pool;