
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { CadastrosEntity } from './cadastros.entity';

// ==========================================================
// CREATE
// ==========================================================
export const cadastrosCreateSchema = z
  .object({
    id_empresas: z.number().int().nonnegative().optional(),
    id_visitantes: z.number().int().nonnegative().optional(),
    id_consumidores: z.number().int().nonnegative().optional(),
    id_clientes: z.number().int().nonnegative().optional(),
    id_fornecedores: z.number().int().nonnegative().optional(),
    id_funcionarios: z.number().int().nonnegative().optional(),

    id_cidades: z.number().int().nonnegative().optional(),
    id_imagens: z.number().int().nonnegative().optional(),

    endereco: z
      .string()
      .trim()
      .max(200, 'Endereço deve ter no máximo 200 caracteres')
      .optional()
      .nullable(),

    complemento: z
      .string()
      .trim()
      .max(200, 'Complemento deve ter no máximo 200 caracteres')
      .optional()
      .nullable(),

    bairro: z
      .string()
      .trim()
      .max(100, 'Bairro deve ter no máximo 100 caracteres')
      .optional()
      .nullable(),

    cep: z
      .string()
      .trim()
      .max(8, 'CEP deve ter no máximo 8 caracteres')
      .optional()
      .nullable(),

    has_email: z.number().int().min(0).max(1).optional(),
    has_doc: z.number().int().min(0).max(1).optional(),
    has_fone: z.number().int().min(0).max(1).optional(),

    createdBy: z.number().int().nonnegative().optional(),
    updatedBy: z.number().int().nonnegative().optional()
  })
  .refine((data) => {
    const camposOrigem = [
      data.id_empresas ?? 0,
      data.id_visitantes ?? 0,
      data.id_consumidores ?? 0,
      data.id_clientes ?? 0,
      data.id_fornecedores ?? 0,
      data.id_funcionarios ?? 0
    ];

    const ativos = camposOrigem.filter((valor) => valor > 0).length;
    return ativos === 1;
  }, {
    message:
      'Deve existir exatamente um id de origem ativo entre id_empresas, id_visitantes, id_consumidores, id_clientes, id_fornecedores e id_funcionarios'
  });

// ==========================================================
// UPDATE
// ==========================================================
export const cadastrosUpdateSchema = cadastrosCreateSchema
  .partial()
  .extend({
    id: z
      .number()
      .int()
      .positive('ID inválido para update')
      .optional()
  });

// ==========================================================
// TYPES
// ==========================================================
export type CadastrosCreate = z.infer<typeof cadastrosCreateSchema>;
export type CadastrosUpdate = z.infer<typeof cadastrosUpdateSchema>;
export type CadastrosDto = DeepPartial<CadastrosEntity>;