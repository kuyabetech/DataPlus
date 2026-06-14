const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Register
router.post(
  '/register',
  [
    body('fullName').notEmpty().trim(),
    body('phone').isMobilePhone(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, phone, email, password } = req.body;

    try {
      // Check if user exists
      const userExists = await pool.query(
        'SELECT * FROM users WHERE phone = $1 OR email = $2',
        [phone, email]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate referral code
      const referralCode = 'REF' + Date.now().toString(36).toUpperCase();

      // Create user
      const result = await pool.query(
        `INSERT INTO users (full_name, phone, email, password_hash, referral_code) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, phone, email`,
        [fullName, phone, email, hashedPassword, referralCode]
      );

      // Create wallet for user
      await pool.query(
        `INSERT INTO wallets (user_id, balance) VALUES ($1, $2)`,
        [result.rows[0].id, 0]
      );

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [body('phone').notEmpty(), body('password').notEmpty()],
  async (req, res) => {
    const { phone, password } = req.body;

    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE phone = $1',
        [phone]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          phone: user.phone,
          email: user.email,
          kycStatus: user.kyc_status,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiry
    await pool.query(
      `INSERT INTO password_resets (user_id, otp, expires_at) 
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
      [user.rows[0].id, otp]
    );

    // Send SMS via Termii
    // await sendSMS(phone, `Your DataPlus OTP is: ${otp}`);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reset = await pool.query(
      `SELECT * FROM password_resets 
       WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()`,
      [user.rows[0].id, otp]
    );

    if (reset.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      hashedPassword,
      user.rows[0].id,
    ]);

    await pool.query('DELETE FROM password_resets WHERE user_id = $1', [
      user.rows[0].id,
    ]);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;