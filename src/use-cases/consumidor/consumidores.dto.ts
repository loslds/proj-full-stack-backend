
//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ConsumidoresEntity } from './consumidores.entity';

export const consumidoresCreateSchema = z.object({
  nome: z.string().trim().min(3).max(60),
  fantasy: z.string().trim().min(2).max(60),

  id_empresas: z.number().int().nonnegative().optional(),
  id_pessoas: z.number().int().nonnegative().optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional(),
});

export const consumidoresUpdateSchema = consumidoresCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type ConsumidoresCreate = z.infer<typeof consumidoresCreateSchema>;
export type ConsumidoresUpdate = z.infer<typeof consumidoresUpdateSchema>;
export type ConsumidoresDto = DeepPartial<ConsumidoresEntity>;