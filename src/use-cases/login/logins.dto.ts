

// C:\repository\proj-full-stack-backend\src\use-cases\login\logins.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { LoginsEntity } from './logins.entity';

// ==========================================================
// CREATE
// ==========================================================
export const loginsCreateSchema = z.object({
  id_users: z.number().int().nonnegative().optional(),

  dt_login: z.coerce.date().optional(),
  dt_logout: z.coerce.date().optional(),
  tt_minutos: z.number().int().nonnegative().optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const loginsUpdateSchema = loginsCreateSchema.partial().extend({
  id: z.number().int().positive().optional()
});

// ==========================================================
// TYPES
// ==========================================================
export type LoginsCreate = z.infer<typeof loginsCreateSchema>;
export type LoginsUpdate = z.infer<typeof loginsUpdateSchema>;
export type LoginsDto = DeepPartial<LoginsEntity>;

