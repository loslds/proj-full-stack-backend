
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { PessoasEntity } from './pessoas.entity';

export const pessoasCreateSchema = z.object({
  nome: z.string().min(3),
  sigla: z.string().min(2),
});

export const pessoasUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  sigla: z.string().min(2).optional(),
});

export type PessoasCreate = z.infer<typeof pessoasCreateSchema>;
export type PessoasUpdate = z.infer<typeof pessoasUpdateSchema>;
export type PessoaDto = DeepPartial<PessoasEntity>

