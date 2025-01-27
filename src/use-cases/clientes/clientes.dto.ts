import { z } from 'zod';

export const clientesCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
});

export const clientesUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
});

export type ClientesCreate = z.infer<typeof clientesCreateSchema>;
export type ClientesUpdate = z.infer<typeof clientesUpdateSchema>;
