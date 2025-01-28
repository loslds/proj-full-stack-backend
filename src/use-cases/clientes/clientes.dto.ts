import { z } from 'zod';

export const clientesCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
  id_pessoa: z.number(),
  id_empresa: z.number().optional(),
});

export const clientesUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
  id_pessoa: z.number().optional(),
  id_empresa: z.number().optional(),
});

export type ClientesCreate = z.infer<typeof clientesCreateSchema>;
export type ClientesUpdate = z.infer<typeof clientesUpdateSchema>;
