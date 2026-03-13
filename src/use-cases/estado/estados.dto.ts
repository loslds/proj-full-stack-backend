// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { EstadosEntity } from './estados.entity';

// =========================
// CREATE
// =========================

export const estadosCreateSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(60, 'Nome deve ter no máximo 60 caracteres'),

  prefixo: z
    .string()
    .min(2, 'Prefixo deve ter ao menos 2 caracteres')
    .max(5, 'Prefixo deve ter no máximo 5 caracteres'),

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

// =========================
// UPDATE
// =========================

export const estadosUpdateSchema = estadosCreateSchema
  .partial()
  .extend({
    id: z
      .number()
      .int()
      .positive('ID inválido para update')
  });

// =========================
// TYPES
// =========================

export type EstadosCreate = z.infer<typeof estadosCreateSchema>;
export type EstadosUpdate = z.infer<typeof estadosUpdateSchema>;
export type EstadosDto = DeepPartial<EstadosEntity>;