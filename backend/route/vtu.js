const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Pool } = require('pg');
const axios = require('axios');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get data plans
router.get('/plans', authenticate, async (req, res) => {
  const { network, type } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM data_plans 
       WHERE network = $1 AND is_active = true 
       ORDER BY price ASC`,
      [network]
    );

    res.json({ plans: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Buy data
router.post('/data', authenticate, async (req, res) => {
  const { network, phoneNumber, planId, amount, pin } = req.body;

  try {
    await pool.query('BEGIN');

    // Verify PIN
    const user = await pool.query(
      'SELECT transaction_pin FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!user.rows[0].transaction_pin || user.rows[0].transaction_pin !== pin) {
      return res.status(401).json({ message: 'Invalid transaction PIN' });
    }

    // Check wallet balance
    const wallet = await pool.query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [req.user.id]
    );

    if (wallet.rows[0].balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Get plan details
    const plan = await pool.query(
      'SELECT * FROM data_plans WHERE id = $1',
      [planId]
    );

    // Call VTU API
    const vtuResponse = await axios.post(
      `${process.env.VTU_API_URL}/api/pay`,
      {
        serviceID: network.toLowerCase(),
        phoneNumber,
        variationCode: plan.rows[0].variation_code,
        amount,
      },
      {
        headers: {
          'api-key': process.env.VTU_API_KEY,
        },
      }
    );

    if (vtuResponse.data.code === '000') {
      // Deduct from wallet
      await pool.query(
        'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
        [amount, req.user.id]
      );

      // Create transaction record
      const reference = 'VTU' + Date.now();
      const result = await pool.query(
        `INSERT INTO transactions (user_id, type, amount, reference, status, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [req.user.id, 'data', amount, reference, 'success', JSON.stringify({ network, phoneNumber, planId })]
      );

      await pool.query('COMMIT');

      res.json({
        success: true,
        reference,
        message: 'Data purchased successfully',
      });
    } else {
      throw new Error(vtuResponse.data.response_description);
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: error.message || 'Transaction failed' });
  }
});

// Verify phone number
router.post('/verify', authenticate, async (req, res) => {
  const { network, phoneNumber } = req.body;

  try {
    const response = await axios.post(
      `${process.env.VTU_API_URL}/api/verify`,
      {
        serviceID: network.toLowerCase(),
        phoneNumber,
      },
      {
        headers: {
          'api-key': process.env.VTU_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

module.exports = router;