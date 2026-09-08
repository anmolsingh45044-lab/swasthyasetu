require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bloodRoutes = require('./routes/bloodRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const donationRoutes = require('./routes/donationRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const bedRoutes = require('./routes/bedRoutes');
const oxygenRoutes = require('./routes/oxygenRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const allowed =
        origin === 'http://localhost:5173' ||
        origin.endsWith('.vercel.app');

      if (allowed) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Swasthya Setu API is running.', timestamp: new Date().toISOString() });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Swasthya Setu backend is running",
    timestamp: new Date().toISOString()
  });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/oxygen', oxygenRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] Swasthya Setu API listening on port ${PORT}`);
  });
};

start();

module.exports = app;
