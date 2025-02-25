import { z } from 'zod';

export const setoresCreateSchema = z.object({
  name: z.string().min(5),
  acao: z.string().min(10),  // Torna o campo fantasy obrigatório para a criação
  nivel: z.number(),
});

export const setoresUpdateSchema = z.object({
  name: z.string().min(5).optional(),  // Permite que fantasy seja opcional na atualização
  fantasy: z.string().min(3).optional(),  // Permite que fantasy seja opcional na atualização
  id_pessoa: z.number().optional(),  // Permite que id_pessoa seja opcional na atualização
});

export type SetoresCreate = z.infer<typeof setoresCreateSchema>;
export type SetoresUpdate = z.infer<typeof setoresUpdateSchema>;
