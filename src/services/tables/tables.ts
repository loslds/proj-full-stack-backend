
// C:\repository\proj-full-stack-backend\src\system\tables.ts
/**
 * Tabelas mínimas para o sistema iniciar
 * (infraestrutura / base)
 */
export const systemTables = [
  'systables',
  'pessoas',
  'estados',
  'cidades',
//  'imagens',

  // outras tabelas ......
] as const;

/*////////////////////////////////////////////
 * Tabelas que exigem inserção de dados padrão
 * após a criação
 *///////////////////////////////////////////
export const tablesWithDefaults = [
  'pessoas',
  'estados',
  'cidades',
//  'imagens',

  // outras tabelas ......
] as const;

/**
 * Tabelas que futuramente exigirão
 * sincronização / atualização de registros
 */
export const tablesWithUpdates = [
  // 'empresas',
  // 'consumidores',
  // 'clientes',
  // 'fornecedores',
  // 'funcionarios',
  // 'users',
  // 'cadastros',

  // outras tabelas ......
] as const;

/*//////////////////////////////////////////////////////
 * Total esperado (controle e auditoria)
 *//////////////////////////////////////////////////
export const SYSTEM_TABLES_TOTAL = systemTables.length;

