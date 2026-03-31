

// C:\repository\proj-full-stack-backend\src\use-cases\doc\docs.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { DocsEntity } from './docs.entity';

// ==========================================================
// CREATE
// ==========================================================
export const docsCreateSchema = z
  .object({
    id_cadastros: z
      .number()
      .int()
      .positive('id_cadastros deve ser maior que zero'),

    cpf: z
      .string()
      .trim()
      .max(14, 'CPF deve ter no máximo 14 caracteres')
      .optional()
      .nullable(),

    cnpj: z
      .string()
      .trim()
      .max(18, 'CNPJ deve ter no máximo 18 caracteres')
      .optional()
      .nullable(),

    inscr_estadual: z
      .string()
      .trim()
      .max(20, 'Inscrição estadual deve ter no máximo 20 caracteres')
      .optional()
      .nullable(),

    inscr_municipal: z
      .string()
      .trim()
      .max(20, 'Inscrição municipal deve ter no máximo 20 caracteres')
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
      data.cpf?.trim() ?? '',
      data.cnpj?.trim() ?? '',
      data.inscr_estadual?.trim() ?? '',
      data.inscr_municipal?.trim() ?? ''
    ].filter((valor) => valor !== '').length;

    return ativos >= 1;
  }, {
    message:
      'Deve existir ao menos um documento informado entre cpf, cnpj, inscr_estadual ou inscr_municipal'
  });

// ==========================================================
// UPDATE
// ==========================================================
export const docsUpdateSchema = docsCreateSchema
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
export type DocsCreate = z.infer<typeof docsCreateSchema>;
export type DocsUpdate = z.infer<typeof docsUpdateSchema>;
export type DocsDto = DeepPartial<DocsEntity>;
