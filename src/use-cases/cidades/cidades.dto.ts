import { z } from 'zod';

export const cidadesCreateSchema = z.object({
  nmcidade: z.string().min(3),
  nmestado: z.string().min(3),
  uf: z.string().min(2),
  id_cadastros: z.number(),
});

export const cidadesUpdateSchema = z.object({
  nmestado: z.string().min(3),
  nmcidade: z.string().min(3).optional(),
  uf: z.string().min(2).optional(),
  id_cadastros: z.number().optional(),
});

export type CidadesCreate = z.infer<typeof cidadesCreateSchema>;
export type CidadesUpdate = z.infer<typeof cidadesUpdateSchema>;
