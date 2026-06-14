const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/vtu', require('./routes/vtu'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));

// Webhook for Monnify
app.post('/webhook/monnify', async (req, res) => {
  const { eventType, data } = req.body;
  
  if (eventType === 'SUCCESSFUL_TRANSACTION') {
    // Update wallet balance
    const { amount, customerId, reference } = data;
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
  }
  
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});