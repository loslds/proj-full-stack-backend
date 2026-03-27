
//C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ClientesEntity } from './clientes.entity';

// CREATE
export const clientesCreateSchema = z.object({
  nome: z.string().trim().min(3).max(60),
  fantasy: z.string().trim().min(2).max(60),

  id_empresas: z.number().int().positive(),
  id_pessoas: z.number().int().positive(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// UPDATE
export const clientesUpdateSchema = clientesCreateSchema
  .partial()
  .extend({
    id: z.number().int().positive().optional()
  });

// TYPES
export type ClientesCreate = z.infer<typeof clientesCreateSchema>;
export type ClientesUpdate = z.infer<typeof clientesUpdateSchema>;
export type ClientesDto = DeepPartial<ClientesEntity>;