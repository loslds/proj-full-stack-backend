// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { EstadosEntity} from './estados.entity';

export const estadosCreateSchema = z.object({
  name: z.string().min(3),
  uf: z.string().min(3),
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const estadosUpdateSchema = estadosCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type EstadosCreate = z.infer<typeof estadosCreateSchema>;
export type EstadosUpdate = z.infer<typeof estadosUpdateSchema>;
export type EstadosDto = DeepPartial<EstadosEntity>