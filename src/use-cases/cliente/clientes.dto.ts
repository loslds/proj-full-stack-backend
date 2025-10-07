
//C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ClientesEntity } from './clientes.entity';


export const clientesCreateSchema = z.object({
  nome: z.string().min(3),
  fantasy: z.string().min(2),  // Torna o campo fantasy obrigatório para a criação
  id_pessoas: z.number().optional(), // adicionado,
  id_imagens: z.number().optional(), // adicionado,
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const clientesUpdateSchema = clientesCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type ClientesCreate = z.infer<typeof clientesCreateSchema>;
export type ClientesUpdate = z.infer<typeof clientesUpdateSchema>;
export type ClientesDto = DeepPartial<ClientesEntity>