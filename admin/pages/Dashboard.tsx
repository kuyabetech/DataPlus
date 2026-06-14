import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    walletBalance: 0,
    transactionsToday: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentTransactions();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    // API call to fetch stats
    setStats({
      totalUsers: 1234,
      walletBalance: 2500000,
      transactionsToday: 156,
      successfulTransactions: 148,
      failedTransactions: 8,
    });
  };

  const fetchRecentTransactions = async () => {
    setRecentTransactions([
      { id: 1, user: 'User#4456', type: 'Data', amount: 300, status: 'success', time: '10:30 AM' },
      { id: 2, user: 'User#4455', type: 'Airtime', amount: 200, status: 'success', time: '10:15 AM' },
      { id: 3, user: 'User#4454', type: 'Bill', amount: 5000, status: 'failed', time: '09:45 AM' },
      { id: 4, user: 'User#4453', type: 'Funding', amount: 5000, status: 'success', time: '09:30 AM' },
    ]);
  };

  const fetchChartData = async () => {
    setChartData([
      { name: 'Mon', transactions: 120, revenue: 45000 },
      { name: 'Tue', transactions: 145, revenue: 52000 },
      { name: 'Wed', transactions: 135, revenue: 48000 },
      { name: 'Thu', transactions: 160, revenue: 58000 },
      { name: 'Fri', transactions: 190, revenue: 65000 },
      { name: 'Sat', transactions: 175, revenue: 61000 },
      { name: 'Sun', transactions: 155, revenue: 53000 },
    ]);
  };

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
            <span className="stat-trend up">↑ +12%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Wallet Balance</h3>
            <p className="stat-value">₦{stats.walletBalance.toLocaleString()}</p>
            <span className="stat-trend up">↑ +8%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Today's Transactions</h3>
            <p className="stat-value">{stats.transactionsToday}</p>
            <span className="stat-trend up">↑ +5%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Success Rate</h3>
            <p className="stat-value">
              {((stats.successfulTransactions / stats.transactionsToday) * 100).toFixed(1)}%
            </p>
            <span className="stat-trend up">94.8%</span>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Transaction Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="transactions" stroke="#2563EB" />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx: any) => (
              <tr key={tx.id}>
                <td>{tx.time}</td>
                <td>{tx.user}</td>
                <td>{tx.type}</td>
                <td>₦{tx.amount}</td>
                <td>
                  <span className={`status-badge ${tx.status}`}>
                    {tx.status === 'success' ? '✅ Success' : '❌ Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;