
//C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { CadastrosEntity } from './cadastros.entity';


export const cadastrosCreateSchema = z.object({
  id_empresas: z.number().optional(), // adicionado,
  id_consumidores: z.number().optional(), // adicionado,
  id_clientes: z.number().optional(), // adicionado,
  id_fornecedores: z.number().optional(), // adicionado,
  id_funcionarios: z.number().optional(), // adicionado,
  endereço: z.string().min(3),
  complemento: z.string().min(3),
  bairro: z.string().min(3),
  cep: z.string().min(9),
  has_email: z.number().max(1),
  has_fone: z.number().max(1),
  has_doc: z.number().max(1),
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const cadastrosUpdateSchema = cadastrosCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type CadastrosCreate = z.infer<typeof cadastrosCreateSchema>;
export type CadastrosUpdate = z.infer<typeof cadastrosUpdateSchema>;
export type CadastrosDto = DeepPartial<CadastrosEntity>
