import { z } from 'zod';

// Schema para criação de usuários
export const usersCreateSchema = z.object({
  bloqueado: z.boolean(), // Campo booleano (true/false)
  qdd_acesso: z.number().int().nonnegative(), // Número inteiro não negativo
  ultimo_acesso: z.string().datetime(), // String no formato ISO 8601 (data e hora)
  data_login: z.string().datetime(), // String no formato ISO 8601 (data e hora)
  data_logout: z.string().datetime().optional(), // Opcional (string no formato ISO 8601)
  id_cadastro: z.number().int().positive(), // Número inteiro positivo
});

// Schema para atualização de usuários
export const usersUpdateSchema = z.object({
  bloqueado: z.boolean().optional(), // Opcional para atualizações
  qdd_acesso: z.number().int().nonnegative().optional(), // Número não negativo opcional
  ultimo_acesso: z.string().datetime().optional(), // Opcional
  data_login: z.string().datetime().optional(), // Opcional
  data_logout: z.string().datetime().optional(), // Opcional
  id_cadastro: z.number().int().positive(), // Número inteiro positivo obrigatório
});

// Tipos inferidos a partir dos schemas
export type UsersCreate = z.infer<typeof usersCreateSchema>;
export type UsersUpdate = z.infer<typeof usersUpdateSchema>;

