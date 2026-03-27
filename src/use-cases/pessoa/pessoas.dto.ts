 
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { PessoasEntity } from './pessoas.entity';

// =========================
// CREATE
// =========================
export const pessoasCreateSchema = z.object({

  nome: z
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .max(60, "Nome deve ter no máximo 60 caracteres"),

  sigla: z
    .string()
    .min(2, "Sigla deve ter ao menos 2 caracteres")
    .max(5, "Sigla deve ter no máximo 5 caracteres"),

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

export const pessoasUpdateSchema = pessoasCreateSchema
  .partial()
  .extend({

    id: z
      .number()
      .int()
      .positive("ID inválido para update")

  });

// =========================
// TYPES
// =========================

export type PessoasCreate = z.infer<typeof pessoasCreateSchema>;
export type PessoasUpdate = z.infer<typeof pessoasUpdateSchema>;
export type PessoasDto = DeepPartial<PessoasEntity>;

