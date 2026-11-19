// C:\repository\proj-full-stack-backend\src\use-cases\arquivado\arquivados.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ArquivadosEntity } from './arquivados.entity';

// ==========================================================
// CREATE
// ==========================================================
export const arquivadosCreateSchema = z.object({
  tab_origem: z
    .string()
    .trim()
    .min(2, 'tab_origem deve ter ao menos 2 caracteres')
    .max(30, 'tab_origem deve ter no máximo 30 caracteres'),

  id_origem: z
    .number()
    .int()
    .positive('id_origem deve ser maior que zero'),

  dataorigem: z.coerce.date().nullable().optional(),

  // 0 / vazio = exclusão (sem destino)
  id_destino: z.number().int().nonnegative().optional(),

  tab_destino: z
    .string()
    .trim()
    .max(30, 'tab_destino deve ter no máximo 30 caracteres')
    .optional(),

  motivo: z
    .string()
    .trim()
    .max(30, 'motivo deve ter no máximo 30 caracteres')
    .optional(),

  id_users: z.number().int().nonnegative().optional(),

  nomeusers: z
    .string()
    .trim()
    .max(60, 'nomeusers deve ter no máximo 60 caracteres')
    .optional(),

  createdBy: z.number().int().nonnegative().optional(),

  updatedBy: z.number().int().nonnegative().optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const arquivadosUpdateSchema = arquivadosCreateSchema
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
export type ArquivadosCreate = z.infer<typeof arquivadosCreateSchema>;
export type ArquivadosUpdate = z.infer<typeof arquivadosUpdateSchema>;
export type ArquivadosDto = DeepPartial<ArquivadosEntity>;
