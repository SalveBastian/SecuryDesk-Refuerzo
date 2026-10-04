import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive()
});
