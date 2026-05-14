
// C:\repository\proj-full-stack-backend\src\use-cases\pergresp\pergsresps.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { PergsrespsEntity } from './pergsresps.entity';

// ==========================================================
// CREATE
// ==========================================================
export const pergsrespsCreateSchema = z.object({
  id_chaves: z.number().int().nonnegative().optional(),

  pergunta1: z.string().trim().min(2).max(120),
  resposta1: z.string().trim().min(2).max(120),

  pergunta2: z.string().trim().min(2).max(120),
  resposta2: z.string().trim().min(2).max(120),

  pergunta3: z.string().trim().min(2).max(120),
  resposta3: z.string().trim().min(2).max(120),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const pergsrespsUpdateSchema = pergsrespsCreateSchema.partial().extend({
  id: z.number().int().positive().optional()
});

// ==========================================================
// TYPES
// ==========================================================
export type PergsrespsCreate = z.infer<typeof pergsrespsCreateSchema>;
export type PergsrespsUpdate = z.infer<typeof pergsrespsUpdateSchema>;
export type PergsrespsDto = DeepPartial<PergsrespsEntity>;