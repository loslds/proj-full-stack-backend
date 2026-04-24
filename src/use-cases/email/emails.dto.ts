// C:\repository\proj-full-stack-backend\src\use-cases\email\emails.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { EmailsEntity } from './emails.entity';

// ==========================================================
// BASE
// ==========================================================
const emailsBaseSchema = z.object({
  id_cadastros: z
    .number()
    .int()
    .positive('id_cadastros deve ser maior que zero'),

  email: z
    .string()
    .trim()
    .min(5, 'Email deve ter ao menos 5 caracteres')
    .max(120, 'Email deve ter no máximo 120 caracteres')
    .email('Email inválido'),

  email_resgate: z
    .string()
    .trim()
    .max(120, 'Email de resgate deve ter no máximo 120 caracteres')
    .email('Email de resgate inválido')
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

// ==========================================================
// CREATE
// ==========================================================
export const emailsCreateSchema = emailsBaseSchema;

// ==========================================================
// UPDATE
// ==========================================================
export const emailsUpdateSchema = emailsBaseSchema
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
export type EmailsCreate = z.infer<typeof emailsCreateSchema>;
export type EmailsUpdate = z.infer<typeof emailsUpdateSchema>;
export type EmailsDto = DeepPartial<EmailsEntity>;