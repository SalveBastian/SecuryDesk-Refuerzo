import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

export const adminRouter = Router();

adminRouter.get('/ping', authenticate, authorizeRoles('ADMIN'), (req, res) => {
  res.json({
    status: 'ok',
    message: 'Acceso ADMIN autorizado',
    user: { id: req.user.id, role: req.user.role }
  });
});
