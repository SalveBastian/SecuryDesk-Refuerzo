import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(env.port, () => {
  console.log(`SecureDesk API escuchando en http://localhost:${env.port}`);
});

async function shutdown(signal) {
  console.log(`\n${signal}: cerrando SecureDesk de forma segura...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
