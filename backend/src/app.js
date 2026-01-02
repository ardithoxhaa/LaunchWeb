import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import healthRoutes from './modules/health/health.routes.js';
import templatesRoutes from './modules/templates/templates.routes.js';
import businessesRoutes from './modules/businesses/businesses.routes.js';
import websitesRoutes from './modules/websites/websites.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import publicRoutes from './modules/public/public.routes.js';
import assetsRoutes from './modules/assets/assets.routes.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (env.NODE_ENV !== 'production') {
        if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true);
      }
      if (origin === env.CLIENT_ORIGIN) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/businesses', businessesRoutes);
app.use('/api/websites', websitesRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

app.use(errorHandler);

export default app;
