import { prisma } from '../lib/prisma.js';
import { maskEmail } from '../lib/sanitize.js';
import { logSecurityEvent } from '../lib/securityLogger.js';

export async function createIncident(req, res, next) {
  try {
    const incident = await prisma.incident.create({
      data: {
        ...req.body,
        reporterEmail: req.user.email,
        reporterId: req.user.id
      }
    });

    logSecurityEvent('INCIDENT_CREATED', {
      userId: req.user.id,
      incidentId: incident.id,
      severity: incident.severity
    });

    return res.status(201).json({ incident });
  } catch (error) {
    return next(error);
  }
}

export async function listIncidents(req, res, next) {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const canViewSensitive = req.user.role === 'ADMIN';
    const safeIncidents = incidents.map((incident) => ({
      ...incident,
      reporterEmail: canViewSensitive ? incident.reporterEmail : maskEmail(incident.reporterEmail)
    }));

    return res.json({ incidents: safeIncidents });
  } catch (error) {
    return next(error);
  }
}
