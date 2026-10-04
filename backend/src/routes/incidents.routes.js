import { Router } from 'express';
import { createIncident, listIncidents } from '../controllers/incidents.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { sanitizeBody } from '../middlewares/sanitize.js';
import { validate } from '../middlewares/validate.js';
import { createIncidentSchema } from '../validators/incidents.js';

export const incidentsRouter = Router();

incidentsRouter.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'ANALISTA', 'CONSULTA'),
  listIncidents
);

incidentsRouter.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'ANALISTA'),
  sanitizeBody,
  validate(createIncidentSchema),
  createIncident
);
