
// src/use-cases/imagen/imagens.dto.ts

// src/use-cases/imagens/imagens.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { Buffer } from 'buffer';
import { ImagensEntity } from './imagens.entity';

/**
 * 🧭 Mapeamento dos tipos numéricos (conforme entity)
 * 1 - DEFAULT
 * 2 - LOGO
 * 3 - PAINEL
 * 4 - AVATAR
 * 5 - BOTAO
 */
export const arqTipoEnumNumeric = z.union([
  z.literal(1), // default
  z.literal(2), // logo
  z.literal(3), // painel
  z.literal(4), // avatar
  z.literal(5), // botao
]);

/**
 * 🧭 Mapeamento das ações numéricas (conforme entity)
 * 1 - VISUALIZA
 * 2 - CADASTRO
 * 3 - INCLUSAO
 * 4 - ALTERACAO
 * 5 - EXCLUSAO
 * 6 - LISTAGEM
 * 7 - HELP
 */
export const arqAcaoEnumNumeric = z.union([
  z.literal(1), // visualiza
  z.literal(2), // cadastro
  z.literal(3), // inclusao
  z.literal(4), // alteracao
  z.literal(5), // exclusao
  z.literal(6), // listagem
  z.literal(7), // help
]);

// 📌 Schema base para criação
export const imagensCreateSchema = z.object({
  // IDs relacionais opcionais
  id_empresas: z.number().int().positive().optional(),
  id_consumidores: z.number().int().positive().optional(),
  id_clientes: z.number().int().positive().optional(),
  id_fornecedores: z.number().int().positive().optional(),
  id_funcionarios: z.number().int().positive().optional(),
  id_default: z.number().int().nonnegative().optional(),

  // Dados da imagem
  arqTipo: arqTipoEnumNumeric,  // ✅ agora número
  arqAcao: arqAcaoEnumNumeric,  // ✅ agora número
  arqPage: z.string().max(100).optional().nullable(),
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
