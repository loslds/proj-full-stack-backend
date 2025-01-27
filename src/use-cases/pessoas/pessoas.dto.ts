
import { z } from 'zod';

export const pessoasCreateSchema = z.object({
  nmpessoa: z.string().min(3),
  sigla: z.string().min(2),
});

export const pessoasUpdateSchema = z.object({
  nmpessoa: z.string().min(3).optional(),
  sigla: z.string().min(2).optional(),
});

export type PessoasCreate = z.infer<typeof pessoasCreateSchema>;
export type PessoasUpdate = z.infer<typeof pessoasUpdateSchema>;

