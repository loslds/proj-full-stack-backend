
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { PessoasEntity } from './pessoas.entity';

export const pessoasCreateSchema = z.object({
  nome: z.string().min(3),
  sigla: z.string().min(2),
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const pessoasUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  sigla: z.string().min(2).optional(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
});

export type PessoasCreate = z.infer<typeof pessoasCreateSchema>;
export type PessoasUpdate = z.infer<typeof pessoasUpdateSchema>;
export type PessoasDto = DeepPartial<PessoasEntity>;

