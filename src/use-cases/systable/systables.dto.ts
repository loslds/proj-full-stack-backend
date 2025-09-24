
//C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.dto.ts
import { SystablesEntity } from './systables.entity';
import { z } from 'zod';
import { DeepPartial } from 'typeorm';

export const systablesCreateSchema = z.object({
  nome: z.string().min(3),
  chkdb: z.number().max(1),
  numberregs: z.number().max(7),
  createdBy: z.number().optional(), // adicionado
  updatedBy: z.number().optional(), // adicionado

});

export const systablesUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  chkdb: z.number().max(1),
  numberregs: z.number().max(7),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
});

export type SystablesCreate = z.infer<typeof systablesCreateSchema>;
export type SystablesUpdate = z.infer<typeof systablesUpdateSchema>;
export type SystablesDto = DeepPartial<SystablesEntity>
//////////////////////////////////
