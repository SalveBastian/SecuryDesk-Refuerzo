import 'dotenv/config';

const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 60),
  loginRateLimitMax: Number(process.env.LOGIN_RATE_LIMIT_MAX ?? 10),
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
};
