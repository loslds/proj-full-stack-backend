
//C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.dto.ts

// C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ChavesEntity } from './chaves.entity';

// ==========================================================
// CREATE
// ==========================================================
export const chavesCreateSchema = z.object({
  id_users: z.number().int().nonnegative().optional(),

  identificador: z.string().trim().min(4).max(60),
  psw_hash: z.string().trim().min(10).max(60),
  min_hash: z.string().trim().min(4).max(60),

  ativo: z.boolean().optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const chavesUpdateSchema = chavesCreateSchema.partial().extend({
  id: z.number().int().positive().optional()
});

// ==========================================================
// TYPES
// ==========================================================
export type ChavesCreate = z.infer<typeof chavesCreateSchema>;
export type ChavesUpdate = z.infer<typeof chavesUpdateSchema>;
export type ChavesDto = DeepPartial<ChavesEntity>;

