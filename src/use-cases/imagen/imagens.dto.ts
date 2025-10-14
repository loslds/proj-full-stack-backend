
// src/use-cases/imagen/imagens.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { Buffer } from 'buffer';
import { ImagensEntity } from './imagens.entity';

// Enum de tipos de imagem (agora completo)
const arqTipoEnum = z.enum([
  'default',
  'logo',
  'avatar',
  'inclusao',
  'alteracao',
  'exclusao',
  'listagem',
  'help',
]);

// 📌 Schema base para criação
export const imagensCreateSchema = z.object({
  // Campos relacionais (opcionais)
  id_empresas: z.number().int().positive().optional(),
  id_consumidores: z.number().int().positive().optional(),
  id_clientes: z.number().int().positive().optional(),
  id_fornecedores: z.number().int().positive().optional(),
  id_funcionarios: z.number().int().positive().optional(),
  id_default: z.number().int().nonnegative().optional(),
  
  // Dados da imagem
  arqTipo: arqTipoEnum,
  arqPage: z.string().max(100).optional().nullable(),  // ✅ novo campo
  arqNome: z.string().max(150),
  arqPath: z.string().max(255),
  arqBlob: z.union([z.instanceof(Buffer), z.string(), z.null()]).optional(),

  // Auditoria
  createBy: z.number().int().nonnegative().optional(),
  updateBy: z.number().int().nonnegative().optional(),
});

// 📌 Schema para atualização — parcial + ID obrigatório
export const imagensUpdateSchema = imagensCreateSchema.partial().extend({
  id: z.number().int().positive(),
});

// 📌 Tipos TypeScript derivados dos schemas
export type ImagensCreate = z.infer<typeof imagensCreateSchema>;
export type ImagensUpdate = z.infer<typeof imagensUpdateSchema>;

// DTO genérico baseado na entidade
export type ImagensDto = DeepPartial<ImagensEntity>;