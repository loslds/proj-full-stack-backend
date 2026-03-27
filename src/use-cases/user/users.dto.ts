

/// C:\repository\proj-full-stack-backend\src\use-cases\user\users.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { UsersEntity } from './users.entity';

// ==========================================================
// CREATE
// ==========================================================
export const usersCreateSchema = z.object({
  id_cadastros: z.number().int().nonnegative().optional(),
  
  is_actived: z.number().int().min(0).max(1).optional(),

  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

// ==========================================================
// UPDATE
// ==========================================================
export const usersUpdateSchema = usersCreateSchema.partial().extend({
  id: z.number().int().positive().optional()
});

// ==========================================================
// TYPES
// ==========================================================
export type UsersCreate = z.infer<typeof usersCreateSchema>;
export type UsersUpdate = z.infer<typeof usersUpdateSchema>;
export type UsersDto = DeepPartial<UsersEntity>;