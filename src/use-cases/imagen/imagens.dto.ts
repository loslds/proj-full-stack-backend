
// C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { Buffer } from 'buffer'; // 👈 importante para usar no zod
import { ImagensEntity } from './imagens.entity';

const arqTipoEnum = z.enum(['logo', 'avatar']);

export const imagensCreateSchema = z.object({
  arqTipo: arqTipoEnum,
  arqNome: z.string().max(150),
  arqPath: z.string().max(255),
  // aceita Buffer (binário), string (ex: base64) ou null
  arqBlob: z.union([z.instanceof(Buffer), z.string(), z.null()]).optional(),
  createBy: z.number().int().nonnegative().optional(),
  updateBy: z.number().int().nonnegative().optional(),
});

export const imagensUpdateSchema = imagensCreateSchema.partial().extend({
  id: z.number().int().positive().optional(), // caso queira atualizar por id
});

export type ImagensCreate = z.infer<typeof imagensCreateSchema>;
export type ImagensUpdate = z.infer<typeof imagensUpdateSchema>;
export type ImagensDto = DeepPartial<ImagensEntity>;

