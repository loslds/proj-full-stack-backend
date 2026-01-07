
//C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.dto.ts
import { z } from 'zod';
import { DeepPartial } from 'typeorm';
import type { SystablesEntity } from './systables.entity';

// ========================
// CREATE
// ========================
export const systablesCreateSchema = z.object({
  nome: z.string().min(3).max(60),

  chkdb: z
    .number()
    .int()
    .min(0)
    .max(1)
    .default(0),

  numberregs: z
    .number()
    .int()
    .min(0)
    .default(0),
});

// ========================
// UPDATE
// ========================
export const systablesUpdateSchema = z.object({
  nome: z.string().min(3).max(60).optional(),

  chkdb: z
    .number()
    .int()
    .min(0)
    .max(1)
    .optional(),

  numberregs: z
    .number()
    .int()
    .min(0)
    .optional(),
});

// ========================
// TYPES
// ========================
export type SystablesCreate = z.infer<typeof systablesCreateSchema>;
export type SystablesUpdate = z.infer<typeof systablesUpdateSchema>;
export type SystablesDto = DeepPartial<SystablesEntity>;




// import { SystablesEntity } from './systables.entity';
// import { z } from 'zod';
// import { DeepPartial } from 'typeorm';

// export const systablesCreateSchema = z.object({
//   nome: z.string().min(3).max(60),
//   chkdb: z.number().int().min(0).max(1).default(0),
//   numberregs: z.number().int().min(0).default(0),
// });

// export const systablesUpdateSchema = z.object({
//   nome: z.string().min(3).max(60).optional(),
//   chkdb: z.number().int().min(0).max(1).optional(),
//   numberregs: z.number().int().min(0).optional(),
// });

// export type SystablesCreate = z.infer<typeof systablesCreateSchema>;
// export type SystablesUpdate = z.infer<typeof systablesUpdateSchema>;
// export type SystablesDto = DeepPartial<SystablesEntity>;

