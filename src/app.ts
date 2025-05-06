import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();

const app = express();

// Use CORS with frontend URL from environment
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Development logging
app.use(morgan('dev'));

// Main route
app.use('/api/v1', appRouter);

export default app;
