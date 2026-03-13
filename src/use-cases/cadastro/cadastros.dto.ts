
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.dto.ts

import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { CadastrosEntity } from './cadastros.entity';

// ============================================================
// CREATE
// ============================================================

export const cadastrosCreateSchema = z.object({
  id_empresas: z
    .number()
    .int('id_empresas deve ser inteiro')
    .positive('id_empresas deve ser maior que zero'),

  id_consumidores: z
    .number()
    .int('id_consumidores deve ser inteiro')
    .positive('id_consumidores deve ser maior que zero'),

  id_clientes: z
    .number()
    .int('id_clientes deve ser inteiro')
    .positive('id_clientes deve ser maior que zero'),

  id_fornecedores: z
    .number()
    .int('id_fornecedores deve ser inteiro')
    .positive('id_fornecedores deve ser maior que zero'),

  id_funcionarios: z
    .number()
    .int('id_funcionarios deve ser inteiro')
    .positive('id_funcionarios deve ser maior que zero'),

  id_imagens: z
    .number()
    .int('id_imagens deve ser inteiro')
    .positive('id_imagens deve ser maior que zero'),

  id_cidades: z
    .number()
    .int('id_cidades deve ser inteiro')
    .positive('id_cidades deve ser maior que zero'),

  grupo: z
    .string()
    .min(3, 'grupo deve ter ao menos 3 caracteres')
    .max(30, 'grupo deve ter no máximo 30 caracteres'),

  status: z
    .string()
    .min(3, 'status deve ter ao menos 3 caracteres')
    .max(20, 'status deve ter no máximo 20 caracteres')
    .optional(),

  endereco: z
    .string()
    .min(3, 'endereco deve ter ao menos 3 caracteres')
    .max(200, 'endereco deve ter no máximo 200 caracteres'),

  complemento: z
    .string()
    .min(1, 'complemento deve ter ao menos 1 caractere')
    .max(200, 'complemento deve ter no máximo 200 caracteres'),

  bairro: z
    .string()
    .min(3, 'bairro deve ter ao menos 3 caracteres')
    .max(100, 'bairro deve ter no máximo 100 caracteres'),

  cep: z
    .string()
    .min(8, 'cep deve ter ao menos 8 caracteres')
    .max(10, 'cep deve ter no máximo 10 caracteres'),

  has_email: z
    .number()
    .int('has_email deve ser inteiro')
    .min(0, 'has_email deve ser 0 ou 1')
    .max(1, 'has_email deve ser 0 ou 1'),

  has_fone: z
    .number()
    .int('has_fone deve ser inteiro')
    .min(0, 'has_fone deve ser 0 ou 1')
    .max(1, 'has_fone deve ser 0 ou 1'),

  has_doc: z
    .number()
    .int('has_doc deve ser inteiro')
    .min(0, 'has_doc deve ser 0 ou 1')
    .max(1, 'has_doc deve ser 0 ou 1'),

  createdBy: z
    .number()
    .int('createdBy deve ser inteiro')
    .nonnegative('createdBy não pode ser negativo')
    .optional(),

  updatedBy: z
    .number()
    .int('updatedBy deve ser inteiro')
    .nonnegative('updatedBy não pode ser negativo')
    .optional()
});

// ============================================================
// UPDATE
// ============================================================

export const cadastrosUpdateSchema = cadastrosCreateSchema.partial().extend({
  id: z
    .number()
    .int('id deve ser inteiro')
    .positive('id inválido para update')
});

// ============================================================
// TYPES
// ============================================================

export type CadastrosCreate = z.infer<typeof cadastrosCreateSchema>;
export type CadastrosUpdate = z.infer<typeof cadastrosUpdateSchema>;
export type CadastrosDto = DeepPartial<CadastrosEntity>;

