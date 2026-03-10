// src/use-cases/cidades/cidades.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { CidadesEntity } from './cidades.entity';

// =========================
// CREATE
// =========================
export const cidadesCreateSchema = z.object({
  nome: z.string().min(3, 'Nome da cidade deve ter ao menos 3 caracteres'),

  id_estados: z
    .number()
    .int('id_estados deve ser inteiro')
    .positive('id_estados deve ser um número inteiro positivo'),

  createdBy: z
    .number()
    .int('createdBy deve ser inteiro')
    .nonnegative('createdBy não pode ser negativo')
    .optional(),
});

// =========================
// UPDATE
// =========================
export const cidadesUpdateSchema = cidadesCreateSchema.partial().extend({
  id: z
    .number()
    .int('ID deve ser inteiro')
    .positive('ID inválido para update'),

  updatedBy: z
    .number()
    .int('updatedBy deve ser inteiro')
    .nonnegative('updatedBy não pode ser negativo')
    .optional(),
});

// =========================
// TYPES
// =========================
export type CidadesCreate = z.infer<typeof cidadesCreateSchema>;
export type CidadesUpdate = z.infer<typeof cidadesUpdateSchema>;
export type CidadesDto = DeepPartial<CidadesEntity>;