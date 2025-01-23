import { z } from 'zod';

export const codsegsCreateSchema = z.object({
  codigo: z.string().min(4),
  id_cadastro: z.number(),
});

export const codsegsUpdateSchema = z.object({
  // [ .optional() ] Permite que id_pessoa seja opcional na atualização
  codigo: z.string().min(4).optional(),
  id_cadastro: z.number().optional(),
});

export type CodsegsCreate = z.infer<typeof codsegsCreateSchema>;
export type CodsegsUpdate = z.infer<typeof codsegsUpdateSchema>;
