const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Register Controller
exports.signup = async (req, res) => {
  const { fullName, email, mobileNumber, dateOfBirth, password } = req.body;

  if (!fullName || !email || !mobileNumber || !dateOfBirth || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    // Check if user with same email exists
    const [existingUser] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // Insert user
    await db.query(
      'INSERT INTO user (full_name, email, mobile_number, date_of_birth, password) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, mobileNumber, dateOfBirth, password]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};