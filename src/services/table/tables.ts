

// C:\repository\proj-full-stack-backend\src\services\table\tables.ts
// /**
//  * Tabelas mínimas para o sistema iniciar
//  * (infraestrutura / base)
//  */
export const systemTables = [
  'systables',
  'pessoas',
  'empresas',
  'visitantes',
  'visitas',
  'consumidores',
  'clientes',
  'fornecedores',
  'funcionarios',
  'estados',
  'cidades',
  'cadastros',
  'emails',
  'docs',
  'fones',
  
  'modulos',
  'cargos',
  'acoes',
  'perguntas',
  'users',
  'logins',
  'acessos',  
  'chaves',
  'pergsresps',
  'imagens',
    
] as const;
//////////////////////////////////////
/**
 * Tabelas que exigem inserção de dados padrão
 * após a criação
 */
//////////////////////////////////////
export const tablesWithDefaults = [
  'systables',
  'pessoas',
  'estados',
  'cidades',
  //'imagens',
  'modulos',
  'cargos',
  'acoes',
  'perguntas',
  'imagens',
] as const;
//////////////////////////////////////
/**
 * Tabelas que futuramente exigirão
 * sincronização / atualização de registros
 */
//////////////////////////////////////
export const tablesWithUpdates = [
  'imagens',
] as const;

export const SYSTEM_TABLES_TOTAL = systemTables.length;

export type SystemTableName = (typeof systemTables)[number];

