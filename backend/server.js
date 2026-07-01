import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';

// Route imports
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import enrollmentRoutes from './routes/enrollments.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);

// Fallback routes (in case VITE_API_URL is configured without /api)
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/lessons', lessonRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/progress', progressRoutes);

// Support exact PDF-specified paths as aliases
app.use('/api/enroll', (req, res, next) => {
  req.url = '/enroll';
  next();
}, enrollmentRoutes);
app.use('/api/my-courses', (req, res, next) => {
  req.url = '/my-courses';
  next();
}, enrollmentRoutes);

app.use('/enroll', (req, res, next) => {
  req.url = '/enroll';
  next();
}, enrollmentRoutes);
app.use('/my-courses', (req, res, next) => {
  req.url = '/my-courses';
  next();
}, enrollmentRoutes);


// Base route
app.get('/', (req, res) => {
  res.json({ message: 'LMS Learn API Server is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
