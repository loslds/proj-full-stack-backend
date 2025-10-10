import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { DocsEntity } from './docs.entity';

export const docsCreateSchema = z.object({
  cpf: z.string().min(11).optional(),
  cnpj: z.string().min(14).optional(),
  inscre: z.string().min(8).optional(),
  inscrm: z.string().min(3).optional(),
  matricula: z.string().min(3).optional(),
  id_cadastros: z.number().optional(),  
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const docsUpdateSchema = docsCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type DocsCreate = z.infer<typeof docsCreateSchema>;
export type DocsUpdate = z.infer<typeof docsUpdateSchema>;
export type DocsDto = DeepPartial<DocsEntity>

