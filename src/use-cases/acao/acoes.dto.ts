
// C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { AcoesEntity } from './acoes.entity';

// =========================
// CREATE
// =========================
export const acoesCreateSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(55, 'Nome deve ter no máximo 55 caracteres'),

  abrev: z
    .string()
    .trim()
    .min(3, 'Abreviação deve ter ao menos 3 caracteres')
    .max(25, 'Abreviação deve ter no máximo 25 caracteres'),

  cor: z
    .string()
    .trim()
    .min(3, 'Cor deve ter ao menos 3 caracteres')
    .max(20, 'Cor deve ter no máximo 20 caracteres'),

  nivel: z
    .number()
    .int()
    .min(1, 'Nível deve ser no mínimo 1')
    .max(5, 'Nível deve ser no máximo 5'),

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
export const acoesUpdateSchema = acoesCreateSchema
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
export type AcoesCreate = z.infer<typeof acoesCreateSchema>;
export type AcoesUpdate = z.infer<typeof acoesUpdateSchema>;
export type AcoesDto = DeepPartial<AcoesEntity>;

