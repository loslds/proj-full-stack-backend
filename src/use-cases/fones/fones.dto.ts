import { z } from 'zod';

export const fonesCreateSchema = z.object({
  fonex: z.string().min(10),
  fonec: z.string().min(10),
  fonez: z.string().min(10),
  id_cadastro: z.number(),
});

export const fonesUpdateSchema = z.object({
  // [ .optional() ] Permite que id_pessoa seja opcional na atualização
  fonex: z.string().min(3).optional(),
  fonec: z.string().min(3).optional(),
  fonez: z.string().min(3).optional(),
  id_cadastro: z.number().optional(),  
  
});

export type FonesCreate = z.infer<typeof fonesCreateSchema>;
export type FonesUpdate = z.infer<typeof fonesUpdateSchema>;
