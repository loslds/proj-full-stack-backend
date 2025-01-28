import { z } from 'zod';

export const emailsCreateSchema = z.object({
  mail: z.string().email(),  // Torna o campo format mail obrigatório para a criação
  mailresg: z.string().email(),  // Torna o campo format mail obrigatório para a criação
  id_cadastro: z.number(),
});

export const emailsUpdateSchema = z.object({
  mail: z.string().email().email().optional(),
  mailresg: z.string().email().optional(),  // Permite que fantasy seja opcional na atualização
  id_cadastro: z.number().optional(),  // Permite que id_pessoa seja opcional na atualização
});

export type EmailsCreate = z.infer<typeof emailsCreateSchema>;
export type EmailsUpdate = z.infer<typeof emailsUpdateSchema>;

