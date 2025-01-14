import { z } from 'zod';

export const fornecedorCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
});

export const fornecedorUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
});

export type FornecedorCreate = z.infer<typeof fornecedorCreateSchema>;
export type FornecedorUpdate = z.infer<typeof fornecedorUpdateSchema>;
