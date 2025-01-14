import { z } from 'zod';

export const clienteCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
});

export const clienteUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
});

export type ClienteCreate = z.infer<typeof clienteCreateSchema>;
export type ClienteUpdate = z.infer<typeof clienteUpdateSchema>;
