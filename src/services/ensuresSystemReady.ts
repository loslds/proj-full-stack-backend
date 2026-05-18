
// C:\repository\proj-full-stack-backend\src\services\ensuresSystemReady.ts

import { checkTables } from "./checkTables";
import {
  systemTables,
  tablesWithDefaults,
  tablesWithUpdates
} from "./table/tables";
import { tableServicesRegistry } from "./table/tableServicesRegistry";
import { systablesService } from "./table/systables.service";

export interface EnsureTableStep {
  table: string;
  action: "create" | "count" | "seed" | "update" | "sync" | "skip" | "error";
  success: boolean;
  message: string;
}

export interface EnsureSystemReadyResult {
  success: boolean;
  database: string;
  steps: EnsureTableStep[];
}

function hasSeed(table: string): boolean {
  return (tablesWithDefaults as readonly string[]).includes(table);
}

function hasUpdate(table: string): boolean {
  return (tablesWithUpdates as readonly string[]).includes(table);
}

async function createAndPrepareTable(
  table: string,
  steps: EnsureTableStep[]
): Promise<void> {
  const service = tableServicesRegistry[table as keyof typeof tableServicesRegistry];

  if (!service) {
    steps.push({
      table,
      action: "skip",
      success: false,
      message: `Tabela <${table}> sem service registrado.`
    });

    return;
  }

  try {
    await service.create();

    steps.push({
      table,
      action: "create",
      success: true,
      message: `Tabela <${table}> criada/verificada com sucesso.`
    });

    const totalBeforeSeed = await service.count();

    if (hasSeed(table) && totalBeforeSeed === 0 && service.seed) {
      await service.seed(
        table === "systables" ? systemTables : undefined
      );

      steps.push({
        table,
        action: "seed",
        success: true,
        message: `Seed executado para <${table}>.`
      });
    }

    if (hasUpdate(table) && service.update) {
      await service.update();

      steps.push({
        table,
        action: "update",
        success: true,
        message: `Update executado para <${table}>.`
      });
    }

    const totalAfter = await service.count();

    steps.push({
      table,
      action: "count",
      success: true,
      message: `Tabela <${table}> possui ${totalAfter} registros.`
    });
  } catch (error: any) {
    steps.push({
      table,
      action: "error",
      success: false,
      message: `Erro ao criar/preparar <${table}>: ${error?.message ?? "erro desconhecido"}`
    });
  }
}

export async function ensureSystemReady(): Promise<EnsureSystemReadyResult> {
  const steps: EnsureTableStep[] = [];

  await systablesService.create();

  const seededTables = [...tablesWithDefaults];

  const nonSeedTables = systemTables.filter(
    (table) =>
      table !== "systables" &&
      !(tablesWithDefaults as readonly string[]).includes(table)
  );

  for (const table of seededTables) {
    await createAndPrepareTable(table, steps);
  }

  await systablesService.sync(systemTables);

  steps.push({
    table: "systables",
    action: "sync",
    success: true,
    message: "systables sincronizada após tabelas com seed."
  });

  for (const table of nonSeedTables) {
    await createAndPrepareTable(table, steps);
  }

  await systablesService.sync(systemTables);

  steps.push({
    table: "systables",
    action: "sync",
    success: true,
    message: "systables sincronizada após todas as tabelas."
  });

  const final = await checkTables();

  return {
    success: final.missingTables.length === 0,
    database: final.database,
    steps
  };
}




// //C:\repository\proj-full-stack-backend\src\services\ensuresSystemReady.ts

// import { checkTables } from "./checkTables";
// import {
//   systemTables,
//   tablesWithDefaults,
//   tablesWithUpdates
// } from "./table/tables";
// import { tableServicesRegistry } from "./table/tableServicesRegistry";

// export interface EnsureTableStep {
//   table: string;
//   action: "create" | "count" | "seed" | "update" | "skip" | "error";
//   success: boolean;
//   message: string;
// }

// export interface EnsureSystemReadyResult {
//   success: boolean;
//   database: string;
//   steps: EnsureTableStep[];
// }

// function hasSeed(table: string): boolean {
//   return (tablesWithDefaults as readonly string[]).includes(table);
// }

// function hasUpdate(table: string): boolean {
//   return (tablesWithUpdates as readonly string[]).includes(table);
// }

// export async function ensureSystemReady(): Promise<EnsureSystemReadyResult> {
//   const steps: EnsureTableStep[] = [];

// console.log(">>> [ensureSystemReady] iniciado");

// console.log(">>> [ensureSystemReady] systemTables:",systemTables);

// console.log(">>> [ensureSystemReady] services registrados:", Object.keys(tableServicesRegistry) );

//   const initial = await checkTables();

// console.log(">>> [ensureSystemReady] missingTables inicial:", initial.missingTables );

//   for (const table of systemTables) {
//     const service = tableServicesRegistry[table];

//     if (!service) {
// console.warn(`>>> [ensureSystemReady] sem service registrado para: ${table}`);

//       steps.push({
//         table,
//         action: "skip",
//         success: true,
//         message: `Tabela <${table}> sem service registrado.`,
//       });

//       continue;
//     }

//     try {
//       const exists = initial.existingTables.includes(table);
// console.log(`>>> [ensureSystemReady] verifica se existe tabela: ${table}` );
//       if (!exists) {
// console.log(`>>> [ensureSystemReady] criando tabela: ${table}` );

//         await service.create();

//         steps.push({
//           table,
//           action: "create",
//           success: true,
//           message: `Tabela <${table}> criada com sucesso.`,
//         });
//       } else {
//         steps.push({
//           table,
//           action: "skip",
//           success: true,
//           message: `Tabela <${table}> já existe.`,
//         });
//       }

//       const total = await service.count();

//       if (hasSeed(table) && total === 0 && service.seed) {
// console.log(`>>> [ensureSystemReady] seed tabela: ${table}`);

//         if (table === "systables") {
//           await service.seed(systemTables);
//         } else {
//           await service.seed();
//         }

//         steps.push({
//           table,
//           action: "seed",
//           success: true,
//           message: `Seed executado para <${table}>.`,
//         });
//       }

//       if (hasUpdate(table) && service.update) {
// console.log(`>>> [ensureSystemReady] update tabela: ${table}`);

//         await service.update();

//         steps.push({
//           table,
//           action: "update",
//           success: true,
//           message: `Update executado para <${table}>.`,
//         });
//       }

//       steps.push({
//         table,
//         action: "count",
//         success: true,
//         message: `Tabela <${table}> possui ${total} registros.`,
//       });
//     } catch (error: any) {
// console.error(`>>> [ensureSystemReady] erro em ${table}:`, error?.message ?? error );

//       steps.push({
//         table,
//         action: "error",
//         success: false,
//         message: `Erro em <${table}>: ${error?.message ?? "erro desconhecido"}`,
//       });
//     }
//   }

//   const final = await checkTables();

// console.log(">>> [ensureSystemReady] missingTables final:",final.missingTables);

// console.log(">>> [ensureSystemReady] finalizado");

//   return {
//     success: final.missingTables.length === 0,
//     database: final.database,
//     steps,
//   };
// }

