//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { FuncionariosEntity} from './funcionarios.entity';

export const funcionariosCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),  // Torna o campo fantasy obrigatório para a criação
  id_empresas: z.number().optional(), // adicionado,
  id_imagens: z.number().optional(), // adicionado,
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const funcionariosUpdateSchema = funcionariosCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type FuncionariosCreate = z.infer<typeof funcionariosCreateSchema>;
export type FuncionariosUpdate = z.infer<typeof funcionariosUpdateSchema>;
export type FuncionariosDto = DeepPartial<FuncionariosEntity>