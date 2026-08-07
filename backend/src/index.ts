import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error-handler.js';

import authRouter from './routes/auth.js';
import documentRouter from './routes/document.js';
import aiRouter from './routes/ai.js';
import billingRouter from './routes/billing.js';

const app = express();

// Security & Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login/register attempts per 15 min
  message: { error: 'Too many authentication attempts, please try again later.' },
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/documents', apiLimiter, documentRouter);
app.use('/api/ai', apiLimiter, aiRouter);
app.use('/api/billing', apiLimiter, billingRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// Central Error Handler
app.use(errorHandler);

const PORT = parseInt(env.PORT, 10);
app.listen(PORT, () => {
  logger.info(`🚀 StudyPilot Backend Server listening on port ${PORT} in ${env.NODE_ENV} mode`);
});
