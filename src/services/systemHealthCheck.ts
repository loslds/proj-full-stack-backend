
//C:\repository\proj-full-stack-backend\src\services\systemHealthCheck.ts
/// src/services/systemHealthCheck.ts
import { checkConnectionService } from './checkConectionService';
import { checkTables } from './checkTables';
import { systablesService } from './tables/systables.service';
import { systemTables } from '../system/tables';

export interface SystemHealthResult {
  success: boolean;
  message: string;
}

export async function systemHealthCheck(): Promise<SystemHealthResult> {
  // 1️⃣ Verifica conexão
  const conn = await checkConnectionService();
  if (!conn.success) {
    throw new Error('Falha de conexão com o banco de dados');
  }

  // 2️⃣ Verifica existência das tabelas conhecidas
  const tablesResult = await checkTables();

  if (tablesResult.missingTables.length > 0) {
    throw new Error(
      `Tabelas ausentes: ${tablesResult.missingTables.join(', ')}`
    );
  }

  // 3️⃣ Sincroniza estado real na systables
  await systablesService.sync(systemTables);

  return {
    success: true,
    message: 'Sistema íntegro e consistente',
  };
}












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


