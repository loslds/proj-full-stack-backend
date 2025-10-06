import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { CidadesEntity} from './cidades.entity';

export const cidadesCreateSchema = z.object({
  nome: z.string().min(3),
  sigla: z.string().min(2),  // Torna o campo fantasy obrigatório para a criação
  id_estados: z.number().optional(), // adicionado,
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const cidadesUpdateSchema = cidadesCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type CidadesCreate = z.infer<typeof cidadesCreateSchema>;
export type CidadesUpdate = z.infer<typeof cidadesUpdateSchema>;
export type CidadesDto = DeepPartial<CidadesEntity>