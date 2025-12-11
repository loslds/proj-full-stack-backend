// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { EstadosEntity } from './estados.entity';

// Schema para criação
export const estadosCreateSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  prefixo: z.string().min(2, "Prefixo deve ter ao menos 2 caracteres"),
  createdBy: z.number().optional(),
});

// Schema para atualização
export const estadosUpdateSchema = estadosCreateSchema.partial().extend({
  id: z.number().int().positive(),
  nome: z.string().min(3).optional(),
  prefixo: z.string().min(2).optional(),
  updatedBy: z.number().optional(),
});

// Types
export type EstadosCreate = z.infer<typeof estadosCreateSchema>;
export type EstadosUpdate = z.infer<typeof estadosUpdateSchema>;
export type EstadosDto = DeepPartial<EstadosEntity>;
