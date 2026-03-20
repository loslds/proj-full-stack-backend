
//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { FuncionariosEntity } from './funcionarios.entity';

export const funcionariosCreateSchema = z.object({
  nome: z.string().trim().min(3).max(60),
  fantasy: z.string().trim().min(2).max(60),

  id_empresas: z.number().int().nonnegative().optional(),
  id_pessoas: z.number().int().nonnegative().optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional(),
});

export const funcionariosUpdateSchema = funcionariosCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type FuncionariosCreate = z.infer<typeof funcionariosCreateSchema>;
export type FuncionariosUpdate = z.infer<typeof funcionariosUpdateSchema>;
export type FuncionariosDto = DeepPartial<FuncionariosEntity>;


