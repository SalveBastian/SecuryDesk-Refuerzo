import { prisma } from '../lib/prisma.js';
import { logSecurityEvent } from '../lib/securityLogger.js';

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true
};

export async function listUsers(_req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: userSelect,
      orderBy: { id: 'asc' }
    });
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
}

async function setActive(req, res, next, active) {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { active },
      select: userSelect
    });

    logSecurityEvent(active ? 'USER_ACTIVATED' : 'USER_DEACTIVATED', {
      actorUserId: req.user.id,
      targetUserId: user.id,
      targetRole: user.role
    });

    return res.json({ user });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return next(error);
  }
}

export function activateUser(req, res, next) {
  return setActive(req, res, next, true);
}

export function deactivateUser(req, res, next) {
  return setActive(req, res, next, false);
}
