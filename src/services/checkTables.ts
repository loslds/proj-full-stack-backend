
// src/services/checkTables.ts
import { AppDataSource } from "../config/db";
import { systemTables } from "./table/tables";

export interface TableCheckStep {
  table: string;
  exists: boolean;
  records: number;
  message: string;
}

export interface CheckTablesResult {
  database: string;
  existingTables: string[];
  missingTables: string[];
  records: Record<string, number>;
  steps: TableCheckStep[];
}

export async function checkTables(): Promise<CheckTablesResult> {
  if (!AppDataSource.isInitialized) {
    throw new Error("DataSource não inicializado");
  }

  const queryRunner = AppDataSource.createQueryRunner();

  const existingTables: string[] = [];
  const missingTables: string[] = [];
  const records: Record<string, number> = {};
  const steps: TableCheckStep[] = [];

  let database = "unknown";

  try {
    await queryRunner.connect();

    const dbResult = await queryRunner.query("SELECT DATABASE() as db");
    database = dbResult?.[0]?.db ?? "unknown";

    const tables = await queryRunner.query("SHOW TABLES");
    const dbTables = tables.map((t: any) => Object.values(t)[0]);

    for (const table of systemTables) {
      if (!dbTables.includes(table)) {
        missingTables.push(table);
        records[table] = 0;

        steps.push({
          table,
          exists: false,
          records: 0,
          message: `Tabela <${table}> ausente.`,
        });

        continue;
      }

      existingTables.push(table);

      try {
        const result = await queryRunner.query(
          `SELECT COUNT(*) as total FROM \`${table}\``
        );

        const total = Number(result[0]?.total ?? 0);
        records[table] = total;

        steps.push({
          table,
          exists: true,
          records: total,
          message: `Tabela <${table}> presente com ${total} registros.`,
        });
      } catch {
        records[table] = 0;

        steps.push({
          table,
          exists: true,
          records: 0,
          message: `Tabela <${table}> presente com 0 registros.`,
        });
      }
    }

    return {
      database,
      existingTables,
      missingTables,
      records,
      steps,
    };
  } finally {
    await queryRunner.release();
  }
}