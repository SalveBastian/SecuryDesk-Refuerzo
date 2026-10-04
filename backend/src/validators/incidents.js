import { z } from 'zod';

export const createIncidentSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(10).max(1000),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
}).strict();
