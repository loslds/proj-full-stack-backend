
//C:\repository\proj-full-stack-backend\src\use-cases\pergunta\perguntas.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { PerguntasEntity } from './perguntas.entity';

// =========================
// CREATE
// =========================

export const perguntasCreateSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),

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

export const perguntasUpdateSchema = perguntasCreateSchema
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

export type PerguntasCreate = z.infer<typeof perguntasCreateSchema>;
export type PerguntasUpdate = z.infer<typeof perguntasUpdateSchema>;
export type PerguntasDto = DeepPartial<PerguntasEntity>;

