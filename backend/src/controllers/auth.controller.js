import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { maskEmail } from '../lib/sanitize.js';
import { logSecurityEvent } from '../lib/securityLogger.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.active) {
      logSecurityEvent('LOGIN_DENIED', { email: maskEmail(email), reason: 'user_unavailable' });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      logSecurityEvent('LOGIN_DENIED', { userId: user.id, reason: 'invalid_password' });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { role: user.role, email: user.email },
      env.jwtSecret,
      { subject: String(user.id), expiresIn: env.jwtExpiresIn, algorithm: 'HS256' }
    );

    logSecurityEvent('LOGIN_SUCCESS', { userId: user.id, role: user.role });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
}
