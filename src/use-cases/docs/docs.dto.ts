import { z } from 'zod';

export const docsCreateSchema = z.object({
  cpf: z.string().min(3),
  cnpj: z.string().min(3),
  inscre: z.string().min(3),
  inscrm: z.string().min(3),
  matricula: z.string().min(3),
  id_cadastro: z.number(),
});

export const docsUpdateSchema = z.object({
  // [ .optional() ] Permite que id_pessoa seja opcional na atualização
  cpf: z.string().min(3).optional(),
  cnpj: z.string().min(3).optional(),
  inscre: z.string().min(3).optional(),
  inscrm: z.string().min(3).optional(),
  matricula: z.string().min(3).optional(),
  id_cadastro: z.number().optional(),  
  
});

export type DocsCreate = z.infer<typeof docsCreateSchema>;
export type DocsUpdate = z.infer<typeof docsUpdateSchema>;
