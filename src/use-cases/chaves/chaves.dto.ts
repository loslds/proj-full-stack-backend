
import { z } from 'zod';

export const modulosCreateSchema = z.object({
  descrperg: z.string().min(10),
-
  id_modulos: z.number().optional(),
});

export const modulosUpdateSchema = z.object({
  descrperg: z.string().min(10).optional(),

  id_modulos: z.number().optional(),
});

export type ModulosCreate = z.infer<typeof modulosCreateSchema>;
export type ModulosUpdate = z.infer<typeof modulosUpdateSchema>;

