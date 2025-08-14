const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test kết nối database
testConnection();

// Routes cơ bản
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Capstone API Fiverr đang chạy!',
    version: '1.0.0',
    database: 'MySQL + Prisma',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      jobs: '/api/jobs',
      rentals: '/api/rentals',
      comments: '/api/comments'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Có lỗi xảy ra!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint không tồn tại!'
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🎯 Server đang chạy trên port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Đang tắt server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Đang tắt server...');
  process.exit(0);
});

