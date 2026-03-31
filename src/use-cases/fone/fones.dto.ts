
// C:\repository\proj-full-stack-backend\src\use-cases\fone\fones.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { FonesEntity } from './fones.entity';

// ==========================================================
// CREATE
// ==========================================================
export const fonesCreateSchema = z
  .object({
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
  })
  .refine((data) => {
    const ativos = [
      data.fone_fixo?.trim() ?? '',
      data.fone_celular?.trim() ?? '',
      data.fone_contacto?.trim() ?? ''
    ].filter((valor) => valor !== '').length;

    return ativos >= 1;
  }, {
    message:
      'Deve existir ao menos um telefone informado entre fone_fixo, fone_celular ou fone_contacto'
  });

// ==========================================================
// UPDATE
// ==========================================================
export const fonesUpdateSchema = fonesCreateSchema
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


