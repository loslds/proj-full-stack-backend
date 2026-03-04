
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
 