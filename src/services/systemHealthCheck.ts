
//C:\repository\proj-full-stack-backend\src\services\systemHealthCheck.ts
import { checkConnectionService } from './checkConectionService';
import { checkTables } from './checkTables';
import { systablesService } from './tables/systables.service';
import { systemTables } from '../system/tables';

export async function systemHealthCheck() {
  // 1️⃣ conexão
  const conn = await checkConnectionService();
  if (!conn.success) {
    throw new Error('Falha de conexão com banco');
  }

  // 2️⃣ estrutura
  const tables = await checkTables();

  if (tables.missingTables.length > 0) {
    throw new Error(
      `Tabelas ausentes: ${tables.missingTables.join(', ')}`
    );
  }

  // 3️⃣ sincronização leve
  await systablesService.sync(systemTables);

  return {
    success: true,
    message: 'Sistema verificado e íntegro',
  };
}


