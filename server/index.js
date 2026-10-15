require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Register all Mongoose models upfront (required for .populate() to work)
require('./models/User');
require('./models/Department');
require('./models/Course');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/risk', require('./routes/risk'));
app.use('/api/recovery', require('./routes/recovery'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/resources', require('./routes/resources'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'EduPulse API running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EduPulse server running on port ${PORT}`));
