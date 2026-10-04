import { Router } from 'express';
import { activateUser, deactivateUser, listUsers } from '../controllers/users.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validate } from '../middlewares/validate.js';
import { userIdSchema } from '../validators/users.js';

export const usersRouter = Router();

usersRouter.use(authenticate, authorizeRoles('ADMIN'));
usersRouter.get('/', listUsers);
usersRouter.patch('/:id/activate', validate(userIdSchema, 'params'), activateUser);
usersRouter.patch('/:id/deactivate', validate(userIdSchema, 'params'), deactivateUser);
