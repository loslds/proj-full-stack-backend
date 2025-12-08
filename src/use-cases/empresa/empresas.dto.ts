//C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { EmpresasEntity} from './empresas.entity';

export const empresasCreateSchema = z.object({
  nome: z.string().min(3),
  fantasy: z.string().min(3),  // Torna o campo fantasy obrigatório para a criação
  id_pessoas: z.number().optional(), // adicionado,
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const empresasUpdateSchema = empresasCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type EmpresasCreate = z.infer<typeof empresasCreateSchema>;
export type EmpresasUpdate = z.infer<typeof empresasUpdateSchema>;
export type EmpresasDto = DeepPartial<EmpresasEntity>