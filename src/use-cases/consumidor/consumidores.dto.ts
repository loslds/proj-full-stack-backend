
//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ConsumidoresEntity } from './consumidores.entity';


export const consumidoresCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),  // Torna o campo fantasy obrigatório para a criação
  id_pessoas: z.number().optional(), // adicionado,
  id_imagens: z.number().optional(), // adicionado,
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado
});

export const consumidoresUpdateSchema = consumidoresCreateSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export type ConsumidoresCreate = z.infer<typeof consumidoresCreateSchema>;
export type ConsumidoresUpdate = z.infer<typeof consumidoresUpdateSchema>;
export type ConsumidoresDto = DeepPartial<ConsumidoresEntity>