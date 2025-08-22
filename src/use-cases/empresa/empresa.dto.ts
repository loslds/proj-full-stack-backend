import { z } from 'zod';

export const empresasCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),  // Torna o campo fantasy obrigatório para a criação
  id_pessoa: z.number(),
});

export const empresasUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),  // Permite que fantasy seja opcional na atualização
  id_pessoa: z.number().optional(),  // Permite que id_pessoa seja opcional na atualização
});

export type EmpresasCreate = z.infer<typeof empresasCreateSchema>;
export type EmpresasUpdate = z.infer<typeof empresasUpdateSchema>;
