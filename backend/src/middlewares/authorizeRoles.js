import { logSecurityEvent } from '../lib/securityLogger.js';

export function authorizeRoles(...allowedRoles) {
  const allowed = new Set(allowedRoles);

  return function authorize(req, res, next) {
    if (!req.user) {
      logSecurityEvent('AUTHORIZATION_DENIED', { path: req.originalUrl, reason: 'no_authenticated_user' });
      return res.status(401).json({ error: 'Autenticación requerida' });
    }

    if (!allowed.has(req.user.role)) {
      logSecurityEvent('AUTHORIZATION_DENIED', {
        path: req.originalUrl,
        userId: req.user.id,
        role: req.user.role,
        allowedRoles
      });
      return res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
    }

    return next();
  };
}
