// src/use-cases/imagens/imagens.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { ImagensEntity } from './imagens.entity';

/**
 * CREATE SCHEMA
 * Campos iguais ao entity, exceto:
 * - id gerado automaticamente
 * - createdAt / updatedAt automáticos
 */
export const imagensCreateSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome da imagem deve ter ao menos 3 caracteres')
    .max(180, 'Nome da imagem deve ter no máximo 180 caracteres'),

  tipo: z
    .string()
    .min(3, 'Tipo da imagem deve ter ao menos 3 caracteres')
    .max(30, 'Tipo da imagem deve ter no máximo 30 caracteres'),

  path_origem: z
    .string()
    .max(255, 'path_origem deve ter no máximo 255 caracteres')
    .nullable()
    .optional(),

  path_dest: z
    .string()
    .max(255, 'path_dest deve ter no máximo 255 caracteres')
    .nullable()
    .optional(),

  svg: z
    .string()
    .min(1, 'Conteúdo SVG é obrigatório'),

  createdBy: z
    .number()
    .int('createdBy deve ser inteiro')
    .nonnegative('createdBy não pode ser negativo')
    .optional(),

  updatedBy: z
    .number()
    .int('updatedBy deve ser inteiro')
    .nonnegative('updatedBy não pode ser negativo')
    .optional(),
});

/**
 * UPDATE SCHEMA
 * Tudo opcional, exceto ID obrigatório
 */
export const imagensUpdateSchema = imagensCreateSchema.partial().extend({
  id: z
    .number()
    .int('ID deve ser inteiro')
    .positive('ID inválido para update'),
});

/**
 * TYPES
 */
export type ImagensCreate = z.infer<typeof imagensCreateSchema>;
export type ImagensUpdate = z.infer<typeof imagensUpdateSchema>;
export type ImagensDto = DeepPartial<ImagensEntity>;

