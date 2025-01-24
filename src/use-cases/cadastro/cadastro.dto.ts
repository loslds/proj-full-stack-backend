
import { z } from 'zod';
import { CadastroEntity } from './cadastro.entity';

export const cadastroCreateSchema = z.object({
  endereco: z.string().min(7).optional().nullable(),
  complemento: z.string().min(3).optional().nullable(),
  cep: z.string().min(8).optional().nullable(),
  bairro: z.string().min(3).optional().nullable(),
  cidade: z.string().min(3).optional().nullable(),
  estado: z.string().min(4).optional().nullable(),
  uf: z.string().min(2).optional().nullable(),

  id_empresa: z.number(),
  id_fornecedo: z.number(),
  id_consumidor: z.number(),
  id_cliente: z.number(),
  id_funcionario: z.number(),
  
});

export const cadastroUpdateSchema = z.object({
  endereco: z.string().min(7).optional().nullable(),
  complemento: z.string().min(3).optional().nullable(),
  cep: z.string().min(8).optional().nullable(),
  bairro: z.string().min(3).optional().nullable(),
  cidade: z.string().min(3).optional().nullable(),
  estado: z.string().min(4).optional().nullable(),
  uf: z.string().min(2).optional().nullable(),

  id_empresa: z.number().optional(),
  id_fornecedo: z.number().optional(),
  id_consumidor: z.number().optional(),
  id_cliente: z.number().optional(),
  id_funcionario: z.number().optional(),
  
});

export type CadastroCreate = z.infer<typeof cadastroCreateSchema> & Partial<CadastroEntity>;
export type CadastroUpdate = z.infer<typeof cadastroUpdateSchema>;

