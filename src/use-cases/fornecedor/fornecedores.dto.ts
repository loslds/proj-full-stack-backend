
//C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\fornecedores.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { FornecedoresEntity } from './fornecedores.entity';

export const fornecedoresCreateSchema = z.object({
  nome: z.string().trim().min(3).max(60),
  fantasy: z.string().trim().min(2).max(60),

  id_empresas: z.number().int().nonnegative().optional(),
  id_pessoas: z.number().int().nonnegative().optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional(),
});

export const fornecedoresUpdateSchema = fornecedoresCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type FornecedoresCreate = z.infer<typeof fornecedoresCreateSchema>;
export type FornecedoresUpdate = z.infer<typeof fornecedoresUpdateSchema>;
export type FornecedoresDto = DeepPartial<FornecedoresEntity>;