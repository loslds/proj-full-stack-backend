
// C:\repository\proj-full-stack-backend\src\use-cases\modulo\modulos.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ModulosEntity } from './modulos.entity';

// =========================
// CREATE
// =========================

export const modulosCreateSchema = z.object({

  nome: z
    .string()
    .min(3, 'Nome do módulo deve ter ao menos 3 caracteres')
    .max(30, 'Nome do módulo deve ter no máximo 30 caracteres'),

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

export const modulosUpdateSchema = modulosCreateSchema.partial().extend({
  id: z
    .number()
    .int()
    .positive('ID inválido para update')

});

// =========================
// TYPES
// =========================

export type ModulosCreate = z.infer<typeof modulosCreateSchema>;
export type ModulosUpdate = z.infer<typeof modulosUpdateSchema>;
export type ModulosDto = DeepPartial<ModulosEntity>;

