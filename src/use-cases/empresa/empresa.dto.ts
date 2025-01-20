import { z } from 'zod';

export const empresaCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),  // Torna o campo fantasy obrigatório para a criação
  id_pessoa: z.number(),
});

export const empresaUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),  // Permite que fantasy seja opcional na atualização
  id_pessoa: z.number().optional(),  // Permite que id_pessoa seja opcional na atualização
});

export type EmpresaCreate = z.infer<typeof empresaCreateSchema>;
export type EmpresaUpdate = z.infer<typeof empresaUpdateSchema>;
