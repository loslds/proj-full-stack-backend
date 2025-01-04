import { z } from 'zod';

export const pessoaCreateSchema = z.object({
  descr: z.string().min(3),
  sigla: z.string().min(2),
});

export const pessoaUpdateSchema = z.object({
  descr: z.string().min(3).optional(),
  sigla: z.string().min(2).optional(),
});

export type PessoaCreate = z.infer<typeof pessoaCreateSchema>;
export type PessoaUpdate = z.infer<typeof pessoaUpdateSchema>;
