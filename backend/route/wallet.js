const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Pool } = require('pg');
const axios = require('axios');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get wallet balance
router.get('/balance', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [req.user.id]
    );

    res.json({ balance: parseFloat(result.rows[0].balance) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate virtual account
router.post('/generate-account', authenticate, async (req, res) => {
  try {
    // Check if user already has account
    const existing = await pool.query(
      'SELECT * FROM wallets WHERE user_id = $1 AND account_number IS NOT NULL',
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      return res.json({
        accountNumber: existing.rows[0].account_number,
        bankName: existing.rows[0].bank_name,
        accountName: existing.rows[0].account_name,
      });
    }

    // Call Monnify API to create virtual account
    const monnifyResponse = await axios.post(
      'https://sandbox.monnify.com/api/v1/bank-transfer/reserved-accounts',
      {
        accountReference: `USER-${req.user.id}-${Date.now()}`,
        accountName: req.user.full_name,
        bankCode: '035', // Wema Bank
        customerName: req.user.full_name,
        customerEmail: req.user.email,
      },
      {
        headers: {
          Authorization: `Bearer ${await getMonnifyToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { accountNumber, bankName } = monnifyResponse.data.responseBody;

    // Save to database
    await pool.query(
      `UPDATE wallets 
       SET account_number = $1, bank_name = $2, account_name = $3 
       WHERE user_id = $4`,
      [accountNumber, bankName, req.user.full_name, req.user.id]
    );

    res.json({
      accountNumber,
      bankName,
      accountName: req.user.full_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate account' });
  }
});

// Get transactions
router.get('/transactions', authenticate, async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({ transactions: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fund wallet webhook
router.post('/webhook', async (req, res) => {
  const { eventType, data } = req.body;

  if (eventType === 'SUCCESSFUL_TRANSACTION') {
    const { amount, customerId, reference } = data;

    try {
      await pool.query('BEGIN');

      // Update wallet balance
      await pool.query(
        'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2',
        [amount, customerId]
      );

      // Log transaction
      await pool.query(
        `INSERT INTO transactions (user_id, type, amount, reference, status) 
         VALUES ($1, $2, $3, $4, $5)`,
        [customerId, 'funding', amount, reference, 'success']
      );

      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error(error);
    }
  }

  res.sendStatus(200);
});

async function getMonnifyToken() {
  const response = await axios.post(
    'https://sandbox.monnify.com/api/v1/auth/login',
    {},
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
        ).toString('base64')}`,
      },
    }
  );
  return response.data.responseBody.accessToken;
}

module.exports = router;