

// C:\repository\proj-full-stack-backend\src\services\systemHealthCheck.ts

import { checkTables, TableCheckStep } from "./checkTables";
import { systemStateService } from "./systemStateService";

export type SystemMode = "LEVE" | "DEV" | "PROD";

export interface SystemHealthResult {
  success: boolean;
  mode: SystemMode;
  initialized: boolean;
  database: string;
  existingTables: string[];
  missingTables: string[];
  records: Record<string, number>;
  steps: TableCheckStep[];
}

/**
 * Verificação NÃO BLOQUEANTE do estado do sistema
 * - nunca cria tabela
 * - nunca executa seed
 * - nunca executa update
 * - apenas informa o estado atual
 */
export async function systemHealthCheck(): Promise<SystemHealthResult> {
  const tablesResult = await checkTables();
  const initialized = systemStateService.isInitialized();

  let mode: SystemMode = "LEVE";

  if (initialized && tablesResult.missingTables.length === 0) {
    mode = "PROD";
  } else if (initialized && tablesResult.missingTables.length > 0) {
    mode = "DEV";
  }

  return {
    success: true,
    mode,
    initialized,
    database: tablesResult.database,
    existingTables: tablesResult.existingTables,
    missingTables: tablesResult.missingTables,
    records: tablesResult.records,
    steps: tablesResult.steps,
  };
}


// //C:\repository\proj-full-stack-backend\src\services\systemHealthCheck.ts
 
// import { checkTables, TableCheckStep } from './checkTables';
// import { systemStateService } from './systemStateService';

// export type SystemMode = 'LEVE' | 'DEV' | 'PROD';

// export interface SystemHealthResult {
//   success: boolean;
//   mode: SystemMode;
//   initialized: boolean;
//   database: string;
//   existingTables: string[];
//   missingTables: string[];
//   records: Record<string, number>;
//   steps: TableCheckStep[];
// }

// /**
//  * Verificação NÃO BLOQUEANTE do estado do sistema
//  * - Nunca inicializa recursos
//  * - Nunca lança erro
//  * - Apenas informa
//  */
// export async function systemHealthCheck(): Promise<SystemHealthResult> {
//   const tablesResult = await checkTables();

//   const initialized = systemStateService.isInitialized();

//   let mode: SystemMode = 'LEVE';

//   if (initialized && tablesResult.missingTables.length === 0) {
//     mode = 'PROD';
//   } else if (initialized) {
//     mode = 'DEV';
//   }

//   return {
//     success: true,
//     mode,
//     initialized,
//     database: tablesResult.database,
//     existingTables: tablesResult.existingTables,
//     missingTables: tablesResult.missingTables,
//     records: tablesResult.records,
//     steps: tablesResult.steps,
//   };
// }