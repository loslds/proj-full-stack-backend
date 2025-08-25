import { SystablesEntity } from './systable.entity';
import { DeepPartial } from 'typeorm';
import { z } from 'zod';


export const systableCreateSchema = z.object({
  nome: z.string().min(3),
  chkdb: z.number().max(1),
});

export const systableUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  chkdb: z.number().max(1),
});

export type SystableCreate = z.infer<typeof systableCreateSchema>;
export type SystableUpdate = z.infer<typeof systableUpdateSchema>;
export type SystableDto = DeepPartial<SystablesEntity>

