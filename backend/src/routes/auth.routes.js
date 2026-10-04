import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { login } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../validators/auth.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.loginRateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de autenticación. Intente más tarde.' }
});

authRouter.post('/login', loginLimiter, validate(loginSchema), login);
