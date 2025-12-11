// src/use-cases/imagens/imagens.dto.ts
import { DeepPartial } from "typeorm";
import { z } from "zod";
import { Buffer } from "buffer";
import { ImagensEntity } from "./imagens.entity";

/**
 * CREATE SCHEMA
 * Campos iguais ao entity, exceto:
 * - id gerado automaticamente
 * - createdAt / updatedAt automáticos
 */
export const imagensCreateSchema = z.object({
  id_cadastros: z.number().int().nonnegative().default(0),

  nome: z.string().max(50),
  nome_ext: z.string().max(80),

  has_avatar: z.number().int().min(0).max(1).default(0),
  has_logo: z.number().int().min(0).max(1).default(0),
  has_panel: z.number().int().min(0).max(1).default(0),
  has_button: z.number().int().min(0).max(1).default(0),
  has_tabela: z.number().int().min(0).max(1).default(0),
  has_foto: z.number().int().min(0).max(1).default(0),

  arqDir: z.string().max(100).default("C:\\SGB"),
  arqPath: z.string().max(255),

  arqBlob: z.union([
    z.instanceof(Buffer),
    z.string(),
    z.null(),
  ]).optional(),

  createdBy: z.number().int().nonnegative().default(0),
  updatedBy: z.number().int().nonnegative().default(0),
});

/**
 * UPDATE SCHEMA
 * Tudo opcional, exceto ID obrigatório
 */
export const imagensUpdateSchema = imagensCreateSchema.partial().extend({
  id: z.number().int().positive(),
});

/**
 * TYPES
 */
export type ImagensCreate = z.infer<typeof imagensCreateSchema>;
export type ImagensUpdate = z.infer<typeof imagensUpdateSchema>;

export type ImagensDto = DeepPartial<ImagensEntity>;
