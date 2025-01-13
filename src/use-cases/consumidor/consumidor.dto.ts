import { z } from 'zod';

export const consumidorCreateSchema = z.object({
  name: z.string().min(3),
});

export const consumidorUpdateSchema = z.object({
  fantasy: z.string().min(3).optional(),
});

export type ConsumidorCreate = z.infer<typeof consumidorCreateSchema>;
export type ConsumidorUpdate = z.infer<typeof consumidorUpdateSchema>;
