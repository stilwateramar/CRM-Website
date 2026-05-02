import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import { errorHandler, notFound } from './middleware/error';
import { startReminderJobs } from './services/reminderService';

import authRoutes from './routes/auth';
import studioRoutes from './routes/studio';
import websiteRoutes from './routes/website';
import classRoutes from './routes/classes';
import bookingRoutes from './routes/bookings';
import blogRoutes from './routes/blog';
import socialRoutes from './routes/social';
import studentRoutes from './routes/students';
import forumRoutes from './routes/forum';
import learningRoutes from './routes/learning';
import paymentRoutes from './routes/payments';
import meetingRoutes from './routes/meetings';
import aiRoutes from './routes/ai';

const app = express();
const PORT = Number(process.env.PORT || 5001);

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (!allowedOrigins || allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
});
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'yogify-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/studios', studioRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

(async () => {
  await connectDB();
  startReminderJobs();
  app.listen(PORT, () => console.log(`Yogify API listening on :${PORT}`));
})();
