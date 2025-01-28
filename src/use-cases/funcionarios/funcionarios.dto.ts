import { z } from 'zod';

export const funcionariosCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
  id_pessoa: z.number(),
  id_empresa: z.number(),
});

export const funcionariosUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
  id_pessoa: z.number().optional(),
  id_empresa: z.number().optional(),
});

export type FuncionariosCreate = z.infer<typeof funcionariosCreateSchema>;
export type FuncionariosUpdate = z.infer<typeof funcionariosUpdateSchema>;
