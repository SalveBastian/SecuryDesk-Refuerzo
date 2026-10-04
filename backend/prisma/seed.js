import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role, Severity } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  { email: 'admin@securedesk.local', name: 'Administrador', role: Role.ADMIN },
  { email: 'analista@securedesk.local', name: 'Analista', role: Role.ANALISTA },
  { email: 'consulta@securedesk.local', name: 'Consulta', role: Role.CONSULTA }
];

async function main() {
  const passwordHash = await bcrypt.hash('Sena2026!', 12);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, active: true, passwordHash },
      create: { ...user, active: true, passwordHash }
    });
  }

  const admin = await prisma.user.findUnique({ where: { email: 'admin@securedesk.local' } });
  const count = await prisma.incident.count();

  if (count === 0) {
    await prisma.incident.create({
      data: {
        title: 'Intentos de acceso anómalos',
        description: 'Se detectaron varios intentos fallidos de autenticación en el entorno de pruebas.',
        severity: Severity.MEDIUM,
        reporterEmail: 'seguridad@securedesk.local',
        reporterId: admin.id
      }
    });
  }

  console.log('Seed completado. Usuarios de laboratorio y datos iniciales disponibles.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
