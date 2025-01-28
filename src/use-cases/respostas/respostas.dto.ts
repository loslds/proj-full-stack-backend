
import { z } from 'zod';
import { RespostasEntity } from './respostas.entity';

export const respostasCreateSchema = z.object({
  perg1: z.string().min(10),
  perg2: z.string().min(10),
  perg3: z.string().min(10),
  resp1: z.string().min(10),
  resp2: z.string().min(10),
  resp3: z.string().min(10),
  id_cadastros: z.number(),
});

export const respostasUpdateSchema = z.object({
  perg1: z.string().min(10).optional(),
  perg2: z.string().min(10).optional(),
  perg3: z.string().min(10).optional(),
  resp1: z.string().min(10).optional().nullable(),
  resp2: z.string().min(10).optional().nullable(),
  resp3: z.string().min(10).optional().nullable(),
  id_cadastros: z.number().optional(),
});

export type RespostasCreate = z.infer<typeof respostasCreateSchema> & Partial<RespostasEntity>;
export type RespostasUpdate = z.infer<typeof respostasUpdateSchema>;

