// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { PessoasEntity } from './pessoas.entity';

// =========================
// CREATE
// =========================
export const pessoasCreateSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  sigla: z.string().min(2, "Sigla deve ter ao menos 2 caracteres"),
  createdBy: z.number().optional(), // quem está criando
});

// =========================
// UPDATE
// =========================
export const pessoasUpdateSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(3).optional(),
  sigla: z.string().min(2).optional(),
  updatedBy: z.number().optional(), // quem está atualizando
});

// =========================
// TYPES
// =========================
export type PessoasCreate = z.infer<typeof pessoasCreateSchema>;
export type PessoasUpdate = z.infer<typeof pessoasUpdateSchema>;
export type PessoasDto = DeepPartial<PessoasEntity>;
