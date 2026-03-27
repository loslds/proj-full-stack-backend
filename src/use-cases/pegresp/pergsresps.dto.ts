

// C:\repository\proj-full-stack-backend\src\use-cases\pergresp\pergsresps.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { PegsRespsEntity } from './pergsresps.entity';

// ==========================================================
// CREATE
// ==========================================================
export const pergsRespsCreateSchema = z.object({
  id_chaves: z.number().int().nonnegative().optional(),

  pergunta1: z.string().trim().min(3).max(120),
  resposta1_hash: z.string().trim().min(4).max(120),

  pergunta2: z.string().trim().min(3).max(120),
  resposta2_hash: z.string().trim().min(4).max(120),

  pergunta3: z.string().trim().min(3).max(120),
  resposta3_hash: z.string().trim().min(4).max(120),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const pergsRespsUpdateSchema = pergsRespsCreateSchema.partial().extend({
  id: z.number().int().positive().optional()
});

// ==========================================================
// TYPES
// ==========================================================
export type PergsRespsCreate = z.infer<typeof pergsRespsCreateSchema>;
export type PergsRespsUpdate = z.infer<typeof pergsRespsUpdateSchema>;
export type PergsRespsDto = DeepPartial<PegsRespsEntity>;

