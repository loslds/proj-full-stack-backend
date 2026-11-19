// C:\repository\proj-full-stack-backend\src\use-cases\servico\servicos.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ServicosEntity } from './servicos.entity';

// ==========================================================
// CREATE
// ==========================================================
export const servicosCreateSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(60, 'Nome deve ter no máximo 60 caracteres'),

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
export const servicosUpdateSchema = servicosCreateSchema
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
export type ServicosCreate = z.infer<typeof servicosCreateSchema>;
export type ServicosUpdate = z.infer<typeof servicosUpdateSchema>;
export type ServicosDto = DeepPartial<ServicosEntity>;