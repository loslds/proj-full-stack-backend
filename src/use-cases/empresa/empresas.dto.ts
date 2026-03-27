// C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { EmpresasEntity } from './empresas.entity';

// ==========================================================
// CREATE
// ==========================================================
export const empresasCreateSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(60, 'Nome deve ter no máximo 60 caracteres'),

  fantasy: z
    .string()
    .trim()
    .min(2, 'Fantasy deve ter ao menos 2 caracteres')
    .max(60, 'Fantasy deve ter no máximo 60 caracteres'),

  id_pessoas: z
    .number()
    .int()
    .positive('id_pessoas deve ser maior que zero'),

  createdBy: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  updatedBy: z
    .number()
    .int()
    .nonnegative()
    .optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const empresasUpdateSchema = empresasCreateSchema
  .partial()
  .extend({
    id: z
      .number()
      .int()
      .positive('ID inválido para update')
      .optional()
  });

// ==========================================================
// TYPES
// ==========================================================
export type EmpresasCreate = z.infer<typeof empresasCreateSchema>;
export type EmpresasUpdate = z.infer<typeof empresasUpdateSchema>;
export type EmpresasDto = DeepPartial<EmpresasEntity>;