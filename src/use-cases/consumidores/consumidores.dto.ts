import { z } from 'zod';

export const consumidoresCreateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3),
  id_pessoa: z.number(),
  id_empresa: z.number(),
});

export const consumidoresUpdateSchema = z.object({
  name: z.string().min(3),
  fantasy: z.string().min(3).optional(),
  id_pessoa: z.number().optional(),
  id_empresa: z.number().optional(),
});

export type ConsumidoresCreate = z.infer<typeof consumidoresCreateSchema>;
export type ConsumidoresUpdate = z.infer<typeof consumidoresUpdateSchema>;
