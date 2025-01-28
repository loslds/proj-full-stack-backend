import { z } from 'zod';

export const fornecedoresCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),  
  id_pessoa: z.number(),
  id_empresa: z.number(),
});

export const fornecedoresUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
  id_pessoa: z.number().optional(),
  id_empresa: z.number().optional(),
});

export type FornecedoresCreate = z.infer<typeof fornecedoresCreateSchema>;
export type FornecedoresUpdate = z.infer<typeof fornecedoresUpdateSchema>;
