import { z } from 'zod';

export const cidadesCreateSchema = z.object({
  nome: z.string().min(3),
  sigla: z.string().min(2),
  id_estados: z.number(),
});

export const cidadesUpdateSchema = z.object({
  nome: z.string().min(3),
  sigla: z.string().min(2),
  id_estados: z.number(),});

export type CidadesCreate = z.infer<typeof cidadesCreateSchema>;
export type CidadesUpdate = z.infer<typeof cidadesUpdateSchema>;
