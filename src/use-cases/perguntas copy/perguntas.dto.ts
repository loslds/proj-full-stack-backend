
import { z } from 'zod';

export const perguntasCreateSchema = z.object({
  descrperg: z.string().min(10),
});

export const perguntasUpdateSchema = z.object({
  descrperg: z.string().min(10).optional(),
});

export type PerguntasCreate = z.infer<typeof perguntasCreateSchema>;
export type PerguntasUpdate = z.infer<typeof perguntasUpdateSchema>;

