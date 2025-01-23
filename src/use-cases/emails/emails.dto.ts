import { z } from 'zod';

export const emailsCreateSchema = z.object({
  mail: z.string().min(3),
  mailresg: z.string().min(3),  // Torna o campo fantasy obrigatório para a criação
  id_cadastro: z.number(),
});

export const emailsUpdateSchema = z.object({
  mail: z.string().min(3),
  mailresg: z.string().min(3).optional(),  // Permite que fantasy seja opcional na atualização
  id_cadastro: z.number().optional(),  // Permite que id_pessoa seja opcional na atualização
});

export type EmailsCreate = z.infer<typeof emailsCreateSchema>;
export type EmailsUpdate = z.infer<typeof emailsUpdateSchema>;
