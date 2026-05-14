

// C:\repository\proj-full-stack-backend\src\services\tables\tables.ts

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
  'imagens',
  'modulos',
  'cargos',
  'acoes',
  'perguntas',
  'users',
  'logins',
  'acessos',  
  'chaves',
  'pergsresps',
  



  
] as const;

export const tablesWithDefaults = [
  'systables',
  'pessoas',
  'estados',
  'cidades',
  'imagens',
  'modulos',
  'cargos',
  'acoes',
  'perguntas',
] as const;

export const tablesWithUpdates = [
  'imagens',
] as const;

export const SYSTEM_TABLES_TOTAL = systemTables.length;

export type SystemTableName = (typeof systemTables)[number];












// // C:\repository\proj-full-stack-backend\src\services\tables\tables.ts
// /**
//  * Tabelas mínimas para o sistema iniciar
//  * (infraestrutura / base)
//  */
// export const systemTables = [
//   // com seed
//   'systables',
//   'pessoas',
//   'estados',
//   'cidades',
//   'imagens',
//   'modulos',
//   'cargos', 
//   'acoes',
//   'perguntas',
//   // sem seed
//   'empresas',        
//   'visitantes',      
//   'visitas',         
//   'consumidores',    
//   'clientes',        
//   'fornecedores',    
//   'funcionarios',
//   'cadastros',
//   'emails',
//   'docs',
//   'fones',


//   // outras tabelas ......
// ] as const;

// /*////////////////////////////////////////////
//  * Tabelas que exigem inserção de dados padrão
//  * após a criação
//  */////////////////////////////////////////// *** CONCLUIDO
// export const tablesWithDefaults = [
//   'pessoas',         
//   'estados',         
//   'cidades',         
//   'imagens',         
//   'modulos',         
//   'cargos',          
//   'acoes',           
//   'perguntas',       
  

//   // outras tabelas ......

// ] as const;

// /**
//  * Tabelas que futuramente exigirão
//  * sincronização / atualização de registros
//  */
// export const tablesWithUpdates = [
  
//   'imagens',

//   // outras tabelas ......
// ] as const;

// /*//////////////////////////////////////////////////////
//  * Total esperado (controle e auditoria)
//  *//////////////////////////////////////////////////
// export const SYSTEM_TABLES_TOTAL = systemTables.length;

