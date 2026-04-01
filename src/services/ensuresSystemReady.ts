
//C:\repository\proj-full-stack-backend\src\services\ensuresSystemReady.ts

import { checkTables } from "./checkTables";
import { systemTables, tablesWithDefaults, tablesWithUpdates } from "./table/tables";
import { tableServicesRegistry } from "./table/tableServicesRegistry";

export interface EnsureTableStep {
  table: string;
  action: "create" | "count" | "seed" | "update" | "skip" | "error";
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

export async function ensureSystemReady(): Promise<EnsureSystemReadyResult> {
  const steps: EnsureTableStep[] = [];

  const initial = await checkTables();

  for (const table of systemTables) {
    const service = tableServicesRegistry[table];

    if (!service) {
      steps.push({
        table,
        action: "skip",
        success: true,
        message: `Tabela <${table}> sem service registrado.`,
      });
      continue;
    }

    try {
      const exists = initial.existingTables.includes(table);

      if (!exists) {
        console.log(`>>> [${table}] create() iniciado`);
        await service.create();
        console.log(`>>> [${table}] create() concluído`);

        steps.push({
          table,
          action: "create",
          success: true,
          message: `Tabela <${table}> criada com sucesso.`,
        });
      } else {
        steps.push({
          table,
          action: "skip",
          success: true,
          message: `Tabela <${table}> já existe.`,
        });
      }

      const total = await service.count();

      console.log(`>>> [${table}] count = ${total}`);

      steps.push({
        table,
        action: "count",
        success: true,
        message: `Tabela <${table}> possui ${total} registros.`,
      });

      if (hasSeed(table) && total === 0 && service.seed) {
        console.log(`>>> [${table}] seed() iniciado`);

        if (table === "systables") {
          await service.seed(systemTables);
        } else {
          await service.seed();
        }

        console.log(`>>> [${table}] seed() concluído`);

        steps.push({
          table,
          action: "seed",
          success: true,
          message: `Seed executado para <${table}>.`,
        });
      }

      if (hasUpdate(table) && service.update) {
        console.log(`>>> [${table}] update() iniciado`);
        await service.update();
        console.log(`>>> [${table}] update() concluído`);

        steps.push({
          table,
          action: "update",
          success: true,
          message: `Update executado para <${table}>.`,
        });
      }
    } catch (error: any) {
      console.error(`>>> [${table}] erro`, error);

      steps.push({
        table,
        action: "error",
        success: false,
        message: `Erro em <${table}>: ${error?.message ?? "erro desconhecido"}`,
      });
    }
  }

  const final = await checkTables();

  return {
    success: true,
    database: final.database,
    steps,
  };
}