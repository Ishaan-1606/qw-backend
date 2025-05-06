import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

config();

const app = express();

// ✅ CORS configuration
const corsOptions = {
  origin: "https://quant-wiz.netlify.app",
  credentials: true
};

app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests globally
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(morgan('dev'));

app.use('/api/v1', appRouter);

export default app;
