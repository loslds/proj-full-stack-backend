import { z } from 'zod';

export const emailCreateSchema = z.object({
  mail: z.string().min(3),
  mailresg: z.string().min(3),  // Torna o campo fantasy obrigatório para a criação
  id_cadastro: z.number(),
});

export const emailUpdateSchema = z.object({
  mail: z.string().min(3),
  mailresg: z.string().min(3).optional(),  // Permite que fantasy seja opcional na atualização
  id_cadastro: z.number().optional(),  // Permite que id_pessoa seja opcional na atualização
});

export type EmailCreate = z.infer<typeof emailCreateSchema>;
export type EmailUpdate = z.infer<typeof emailUpdateSchema>;
