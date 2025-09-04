import { SystablesEntity } from './systables.entity';
import { DeepPartial } from 'typeorm';
import { z } from 'zod';


export const systablesCreateSchema = z.object({
  nome: z.string().min(3),
  chkdb: z.number().max(1),
  numberregs: z.number().max(7),
});

export const systablesUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  chkdb: z.number().max(1),
  numberregs: z.number().max(7),
});

export type SystablesCreate = z.infer<typeof systablesCreateSchema>;
export type SystablesUpdate = z.infer<typeof systablesUpdateSchema>;
export type SystablesDto = DeepPartial<SystablesEntity>

