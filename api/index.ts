import express from 'express';
import { getDb } from '../server/db.ts';
import { apiRouter } from '../server/routes.ts';

const app = express();

// Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize DB before handling requests
let dbInitialized = false;
app.use(async (_req, _res, next) => {
  if (!dbInitialized) {
    try {
      await getDb();
      dbInitialized = true;
    } catch (e) {
      console.error('[Vercel Serverless] Failed to initialize database:', e);
    }
  }
  next();
});

// Favicon redirect
app.get('/favicon.ico', (_req, res) => {
  res.redirect(301, '/favicon.svg');
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', serverless: true, timestamp: new Date().toISOString() });
});

// Mount API routes
app.use('/api', apiRouter);

export default app;
