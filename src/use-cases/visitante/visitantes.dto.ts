

// C:\repository\proj-full-stack-backend\src\use-cases\visitante\visitantes.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { VisitantesEntity } from './visitantes.entity';

export const visitantesCreateSchema = z.object({
  nome: z.string().trim().min(3).max(60),
  fantasy: z.string().trim().min(2).max(60),

  id_empresas: z.number().int().nonnegative().optional(),
  id_pessoas: z.number().int().nonnegative().optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional(),
});

export const visitantesUpdateSchema = visitantesCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type VisitantesCreate = z.infer<typeof visitantesCreateSchema>;
export type VisitantesUpdate = z.infer<typeof visitantesUpdateSchema>;
export type VisitantesDto = DeepPartial<VisitantesEntity>;

