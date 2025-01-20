import { z } from 'zod';

export const cidadeCreateSchema = z.object({
  nmcidade: z.string().min(3),
  nmestado: z.string().min(3),
  uf: z.string().min(2),
});

export const cidadeUpdateSchema = z.object({
  nmestado: z.string().min(3),
  nmcidade: z.string().min(3).optional(),
  uf: z.string().min(2).optional(),
});

export type CidadeCreate = z.infer<typeof cidadeCreateSchema>;
export type CidadeUpdate = z.infer<typeof cidadeUpdateSchema>;
