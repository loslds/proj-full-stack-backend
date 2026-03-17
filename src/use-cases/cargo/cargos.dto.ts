
//C:\repository\proj-full-stack-backend\src\use-cases\cargo\cargos.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { CargosEntity } from './cargos.entity';

// =========================
// CREATE
// =========================
export const cargosCreateSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome do cargo deve ter ao menos 3 caracteres')
    .max(25, 'Nome do cargo deve ter no máximo 25 caracteres'),

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
export const cargosUpdateSchema = cargosCreateSchema.partial().extend({
  id: z
    .number()
    .int()
    .positive('ID inválido para update')
});

// =========================
// TYPES
// =========================
export type CargosCreate = z.infer<typeof cargosCreateSchema>;
export type CargosUpdate = z.infer<typeof cargosUpdateSchema>;
export type CargosDto = DeepPartial<CargosEntity>;