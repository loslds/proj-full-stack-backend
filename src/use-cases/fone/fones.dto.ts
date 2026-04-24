// C:\repository\proj-full-stack-backend\src\use-cases\fone\fones.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { FonesEntity } from './fones.entity';

// ==========================================================
// BASE
// ==========================================================
const fonesBaseSchema = z.object({
  id_cadastros: z
    .number()
    .int()
    .positive('id_cadastros deve ser maior que zero'),

  fone_fixo: z
    .string()
    .trim()
    .max(10, 'fone_fixo deve ter no máximo 10 caracteres')
    .optional()
    .nullable(),

  fone_celular: z
    .string()
    .trim()
    .max(10, 'fone_celular deve ter no máximo 10 caracteres')
    .optional()
    .nullable(),

  fone_contacto: z
    .string()
    .trim()
    .max(10, 'fone_contacto deve ter no máximo 10 caracteres')
    .optional()
    .nullable(),

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

function hasAtLeastOnePhone(data: {
  fone_fixo?: string | null;
  fone_celular?: string | null;
  fone_contacto?: string | null;
}) {
  const ativos = [
    data.fone_fixo?.trim() ?? '',
    data.fone_celular?.trim() ?? '',
    data.fone_contacto?.trim() ?? ''
  ].filter((valor) => valor !== '').length;

  return ativos >= 1;
}

const phoneValidationMessage =
  'Deve existir ao menos um telefone informado entre fone_fixo, fone_celular ou fone_contacto';

// ==========================================================
// CREATE
// ==========================================================
export const fonesCreateSchema = fonesBaseSchema.refine(hasAtLeastOnePhone, {
  message: phoneValidationMessage
});

// ==========================================================
// UPDATE
// ==========================================================
export const fonesUpdateSchema = fonesBaseSchema
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
export type FonesCreate = z.infer<typeof fonesCreateSchema>;
export type FonesUpdate = z.infer<typeof fonesUpdateSchema>;
export type FonesDto = DeepPartial<FonesEntity>;