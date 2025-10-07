
//C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\fornecedores.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { FornecedoresEntity } from './fornecedores.entity';


export const fornecedoresCreateSchema = z.object({
  nome: z.string().min(3),
  fantasy: z.string().min(2),  // Torna o campo fantasy obrigatório para a criação
  id_pessoas: z.number().optional(), // adicionado,
  id_imagens: z.number().optional(), // adicionado,
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const fornecedoresUpdateSchema = fornecedoresCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type FornecedoresCreate = z.infer<typeof fornecedoresCreateSchema>;
export type FornecedoresUpdate = z.infer<typeof fornecedoresUpdateSchema>;
export type FornecedoresDto = DeepPartial<FornecedoresEntity>