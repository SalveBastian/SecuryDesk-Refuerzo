import { sanitizeObject } from '../lib/sanitize.js';

export function sanitizeBody(req, _res, next) {
  req.body = sanitizeObject(req.body);
  next();
}
