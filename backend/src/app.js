import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { adminRouter } from './routes/admin.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { incidentsRouter } from './routes/incidents.routes.js';
import { usersRouter } from './routes/users.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json({ limit: '32kb' }));
app.use(morgan('combined'));

app.use(rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intente más tarde.' }
}));

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/incidents', incidentsRouter);

app.use(notFound);
app.use(errorHandler);
