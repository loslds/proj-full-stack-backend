
//C:\repository\proj-full-stack-backend\src\use-cases\acesso\acessos.dto.ts

// C:\repository\proj-full-stack-backend\src\use-cases\acesso\acessos.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { AcessosEntity } from './acessos.entity';

const permissaoSchema = z.object({
  modulo: z.string().trim().min(2).max(60),
  cargo: z.string().trim().min(2).max(60),
  acao: z.string().trim().min(2).max(120),
  cor: z.string().trim().min(4).max(20),
  nivel: z.number().int().nonnegative()
});

// ==========================================================
// CREATE
// ==========================================================
export const acessosCreateSchema = z.object({
  id_users: z.number().int().nonnegative().optional(),
  permissoes: z.array(permissaoSchema).optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const acessosUpdateSchema = acessosCreateSchema.partial().extend({
  id: z.number().int().positive().optional()
});

// ==========================================================
// TYPES
// ==========================================================
export type AcessosCreate = z.infer<typeof acessosCreateSchema>;
export type AcessosUpdate = z.infer<typeof acessosUpdateSchema>;
export type AcessosDto = DeepPartial<AcessosEntity>;


