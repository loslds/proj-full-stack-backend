
// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { VisitasEntity } from './visitas.entity';

// ==========================================================
// CREATE
// ==========================================================
export const visitasCreateSchema = z.object({
  id_visitantes: z
    .number()
    .int()
    .positive('id_visitantes deve ser maior que zero'),

  tempo_visita: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  saidaAt: z
    .coerce
    .date()
    .nullable()
    .optional(),

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
export const visitasUpdateSchema = visitasCreateSchema
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
export type VisitasCreate = z.infer<typeof visitasCreateSchema>;
export type VisitasUpdate = z.infer<typeof visitasUpdateSchema>;
export type VisitasDto = DeepPartial<VisitasEntity>;