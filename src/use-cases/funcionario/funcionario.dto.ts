import { z } from 'zod';

export const funcionarioCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
});

export const funcionarioUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
});

export type FuncionarioCreate = z.infer<typeof funcionarioCreateSchema>;
export type FuncionarioUpdate = z.infer<typeof funcionarioUpdateSchema>;
