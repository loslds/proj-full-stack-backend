
//C:\repository\proj-full-stack-backend\src\services\systemHealthCheck.ts
// src/services/systemHealthCheck.ts
import { checkTables } from './checkTables';
import { systemStateService } from './systemStateService';

export type SystemMode = 'LEVE' | 'DEV' | 'PROD';

export interface SystemHealthResult {
  success: boolean;
  mode: SystemMode;
  initialized: boolean;
  existingTables: string[];
  missingTables: string[];
}

/**
 * Verificação NÃO BLOQUEANTE do estado do sistema
 * - Nunca inicializa recursos
 * - Nunca lança erro
 * - Apenas informa
 */
export async function systemHealthCheck(): Promise<SystemHealthResult> {
  const tablesResult = await checkTables();

  const initialized = systemStateService.isInitialized();

  let mode: SystemMode = 'LEVE';

  if (initialized && tablesResult.missingTables.length === 0) {
    mode = 'PROD';
  } else if (initialized) {
    mode = 'DEV';
  }

  return {
    success: true,
    mode,
    initialized,
    existingTables: tablesResult.existingTables,
    missingTables: tablesResult.missingTables,
  };
}



// src/services/systemHealthCheck.ts
// import { AppDataSource } from '../config/db';
// import { systemTables } from '../system/tables';
// import { systemStateService } from './systemStateService';

// export type SystemMode = 'LEVE' | 'DEV' | 'PROD';

// export interface SystemHealthResult {
//   success: boolean;
//   mode: SystemMode;
//   initialized: boolean;
//   existingTables: string[];
//   missingTables: string[];
// }

// /**
//  * Verificação NÃO BLOQUEANTE do estado do sistema
//  * - Nunca lança erro
//  * - Nunca encerra o servidor
//  * - Apenas INFORMA
//  */
// export async function systemHealthCheck(): Promise<SystemHealthResult> {
//   // garante conexão
//   if (!AppDataSource.isInitialized) {
//     await AppDataSource.initialize();
//   }

//   // tabelas existentes no banco
//   const rawTables = await AppDataSource.query('SHOW TABLES');
//   const existingTables = rawTables.map(
//     (row: Record<string, string>) => Object.values(row)[0]
//   );

//   // tabelas esperadas
//   const missingTables = systemTables.filter(
//     (table) => !existingTables.includes(table)
//   );

//   // sistema instalado?
//   const initialized = systemStateService.isInitialized();

//   // definição do modo
//   let mode: SystemMode = 'LEVE';

//   if (initialized && missingTables.length === 0) {
//     mode = 'PROD';
//   } else if (initialized) {
//     mode = 'DEV';
//   }

//   return {
//     success: true,
//     mode,
//     initialized,
//     existingTables,
//     missingTables,
//   };
// }


// /// src/services/systemHealthCheck.ts
// import { checkConnectionService } from './checkConectionService';
// import { checkTables } from './checkTables';
// import { systablesService } from './tables/systables.service';
// import { systemTables } from '../system/tables';

// export interface SystemHealthResult {
//   success: boolean;
//   message: string;
// }

// export async function systemHealthCheck(): Promise<SystemHealthResult> {
//   // 1️⃣ Verifica conexão
//   const conn = await checkConnectionService();
//   if (!conn.success) {
//     throw new Error('Falha de conexão com o banco de dados');
//   }

//   // 2️⃣ Verifica existência das tabelas conhecidas
//   const tablesResult = await checkTables();

//   if (tablesResult.missingTables.length > 0) {
//     throw new Error(
//       `Tabelas ausentes: ${tablesResult.missingTables.join(', ')}`
//     );
//   }

//   // 3️⃣ Sincroniza estado real na systables
//   await systablesService.sync(systemTables);

//   return {
//     success: true,
//     message: 'Sistema íntegro e consistente',
//   };
// }












// import { checkConnectionService } from './checkConectionService';
// import { checkTables } from './checkTables';
// import { systablesService } from './tables/systables.service';
// import { systemTables } from '../system/tables';

// export async function systemHealthCheck() {
//   // 1️⃣ conexão
//   const conn = await checkConnectionService();
//   if (!conn.success) {
//     throw new Error('Falha de conexão com banco');
//   }

//   // 2️⃣ estrutura
//   const tables = await checkTables();

//   if (tables.missingTables.length > 0) {
//     throw new Error(
//       `Tabelas ausentes: ${tables.missingTables.join(', ')}`
//     );
//   }

//   // 3️⃣ sincronização leve
//   await systablesService.sync(systemTables);

//   return {
//     success: true,
//     message: 'Sistema verificado e íntegro',
//   };
// }


