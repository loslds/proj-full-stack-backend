
//C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes..dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { AcoesEntity } from './acoes.entity';

// =========================
// CREATE
// =========================
export const acoesCreateSchema = z.object({
  nome: z.string().min(3).max(55),
  abrev: z.string().min(3).max(25),
  cor: z.string().min(3).max(20),

  nivel: z
    .number()
    .int()
    .min(1)
    .max(5),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// =========================
// UPDATE
// =========================
export const acoesUpdateSchema = acoesCreateSchema.partial().extend({
  id: z.number().int().positive()
});

// =========================
// TYPES
// =========================
export type AcoesCreate = z.infer<typeof acoesCreateSchema>;
export type AcoesUpdate = z.infer<typeof acoesUpdateSchema>;
export type AcoesDto = DeepPartial<AcoesEntity>;