
// C:\repository\proj-full-stack-backend\src\services\tables\tables.ts
/**
 * Tabelas mínimas para o sistema iniciar
 * (infraestrutura / base)
 */
export const systemTables = [
  // com seed
  'systables',
  'pessoas',
  'estados',
  'cidades',
  'imagens',
  'modulos',
  'cargos', 
  'acoes',
  'perguntas',
  // sem seed
  'empresas',        
  'visitantes',      
  'visitas',         
  'consumidores',    
  'clientes',        
  'fornecedores',    
  'funcionarios',
  'cadastros',
  'emails',
  'docs',
  'fones',


  // outras tabelas ......
] as const;

/*////////////////////////////////////////////
 * Tabelas que exigem inserção de dados padrão
 * após a criação
 */////////////////////////////////////////// *** CONCLUIDO
export const tablesWithDefaults = [
  'pessoas',         // * CONCLUIDOS
  'estados',         // * CONCLUIDOS
  'cidades',         // * CONCLUIDOS
  'imagens',         // * CONCLUIDOS conten falta seed
  'modulos',         // * CONCLUIDOS
  'cargos',          // * CONCLUIDOS
  'acoes',           // * CONCLUIDOS
  'perguntas',       // * CONCLUIDOS

  'empresas',        // * CONCLUIDOS
  'visitantes',      // * CONCLUIDOS
  'visitas',         // * CONCLUIDOS
  'consumidores',    // * CONCLUIDOS
  'clientes',        // * CONCLUIDOS
  'fornecedores',    // * CONCLUIDOS
  'funcionarios',    // * CONCLUIDOS
  'cadastros',       // * CONCLUIDOS  
  'emails',          // * CONCLUIDOS  
  'docs',            // * CONCLUIDOS  
  'fones',           // * CONCLUIDOS  

  'user',
  'chaves',
  'acessos',
  
  



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

