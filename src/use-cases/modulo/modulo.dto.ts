import { z } from 'zod';

export const moduloCreateSchema = z.object({
  name: z.string().min(3),
});

export const moduloUpdateSchema = z.object({
  name: z.string().min(3).optional(),
});

export type ModuloCreate = z.infer<typeof moduloCreateSchema>;
export type ModuloUpdate = z.infer<typeof moduloUpdateSchema>;
