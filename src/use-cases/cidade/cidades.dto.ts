
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { CidadesEntity } from './cidades.entity';

// =========================
// CREATE
// =========================
export const cidadesCreateSchema = z.object({
  nome: z.string().min(3, "Nome da cidade deve ter ao menos 3 caracteres"),

  uf: z.string().min(2, "Prefixo deve ter ao menos 2 caracteres"),  
  
  id_estados: z.number()
    .int()
    .positive("id_estados deve ser um número inteiro positivo"),

  createdBy: z.number().optional(),
});

// =========================
// UPDATE
// =========================
export const cidadesUpdateSchema = cidadesCreateSchema.partial().extend({  
  id: z.number().int().positive("ID inválido para update"),
  nome: z.string().min(3).optional(),
  uf: z.string().min(2).optional(),
  id_estados: z.number().int().positive().optional(),
  updatedBy: z.number().optional(),
});

// =========================
// TYPES
// =========================
export type CidadesCreate = z.infer<typeof cidadesCreateSchema>;
export type CidadesUpdate = z.infer<typeof cidadesUpdateSchema>;
export type CidadesDto = DeepPartial<CidadesEntity>;
