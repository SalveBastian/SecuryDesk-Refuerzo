import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { logSecurityEvent } from '../lib/securityLogger.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.get('authorization');

    if (!header?.startsWith('Bearer ')) {
      logSecurityEvent('AUTHENTICATION_DENIED', { path: req.originalUrl, reason: 'missing_bearer' });
      return res.status(401).json({ error: 'Autenticación requerida' });
    }

    const token = header.slice('Bearer '.length).trim();
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, email: true, name: true, role: true, active: true }
    });

    if (!user || !user.active) {
      logSecurityEvent('AUTHENTICATION_DENIED', { path: req.originalUrl, reason: 'user_unavailable' });
      return res.status(401).json({ error: 'Usuario no disponible' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      logSecurityEvent('AUTHENTICATION_DENIED', { path: req.originalUrl, reason: error.name });
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    return next(error);
  }
}
