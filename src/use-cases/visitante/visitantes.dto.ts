// C:\repository\proj-full-stack-backend\src\use-cases\visitante\visitantes.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { VisitantesEntity } from './visitantes.entity';

// ==========================================================
// CREATE
// ==========================================================
export const visitantesCreateSchema = z.object({
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

  id_empresas: z
    .number()
    .int()
    .positive('id_empresas deve ser maior que zero'),

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
export const visitantesUpdateSchema = visitantesCreateSchema
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
export type VisitantesCreate = z.infer<typeof visitantesCreateSchema>;
export type VisitantesUpdate = z.infer<typeof visitantesUpdateSchema>;
export type VisitantesDto = DeepPartial<VisitantesEntity>;