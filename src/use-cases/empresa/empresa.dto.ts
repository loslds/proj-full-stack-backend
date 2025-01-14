import { z } from 'zod';

export const empresaCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
});

export const empresaUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
});

export type EmpresaCreate = z.infer<typeof empresaCreateSchema>;
export type EmpresaUpdate = z.infer<typeof empresaUpdateSchema>;
