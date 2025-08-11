const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const loginUser = async (req, res) => {
  const { username } = req.body;
  const password = req.body.password ? req.body.password.trim() : '';

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await argon2.verify(user.password_hash, password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };