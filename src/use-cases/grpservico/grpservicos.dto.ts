// C:\repository\proj-full-stack-backend\src\use-cases\servico\servicos.dto.ts
// C:\repository\proj-full-stack-backend\src\use-cases\grpservico\grpservicos.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';

import { GrpServicosEntity } from './grpservicos.entity';


// ==========================================================
// CREATE
// ==========================================================

export const grpservicosCreateSchema = z.object({

  nome: z
    .string()
    .trim()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

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
// UPDATE
// ==========================================================

export const grpservicosUpdateSchema = grpservicosCreateSchema
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

export type GrpServicosCreate =
  z.infer<typeof grpservicosCreateSchema>;

export type GrpServicosUpdate =
  z.infer<typeof grpservicosUpdateSchema>;

export type GrpServicosDto =
  DeepPartial<GrpServicosEntity>;