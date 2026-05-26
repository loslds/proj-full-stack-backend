
// C:\repository\proj-full-stack-backend\src\services\checkTables.ts

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
    // console.log(">>> [checkTables] iniciado");

    await queryRunner.connect();

    const dbResult = await queryRunner.query(
      "SELECT DATABASE() as db"
    );

    database = dbResult?.[0]?.db ?? "unknown";

    // console.log(">>> [checkTables] database:", database);

    console.log(`Inicio de checagem em Tabelas do BD "${database}"`);

    const tables = await queryRunner.query("SHOW TABLES");

    const dbTables = tables.map(
      (t: any) => String(Object.values(t)[0])
    );

    // console.log(">>> [checkTables] systemTables:", systemTables);
    // console.log(">>> [checkTables] dbTables:", dbTables);

    for (const table of systemTables) {
      // console.log(`>>> [checkTables] verificando tabela: ${table}`);

      //console.log(`Verificando Tabela ["${table}"]`);

      if (!dbTables.includes(table)) {
        // console.log(`>>> [checkTables] tabela ausente: ${table}`);

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

      // console.log(`>>> [checkTables] tabela encontrada: ${table}`);

      existingTables.push(table);

      try {
        const result = await queryRunner.query(
          `SELECT COUNT(*) as total FROM \`${table}\``
        );

        const total = Number(result?.[0]?.total ?? 0);

        records[table] = total;

        console.log(`>>> [checkTables] ${table} total registros: ${total}`);

        steps.push({
          table,
          exists: true,
          records: total,
          message: `Tabela <${table}> presente com ${total} registros.`,
        });
      } catch (error) {
        console.error(
          `Erro ao contar registros da Tabela ["${table}"]`,
          error
        );

        records[table] = 0;

        steps.push({
          table,
          exists: true,
          records: 0,
          message: `Tabela <${table}> presente com 0 registros.`,
        });
      }
    }

    // console.log(">>> [checkTables] existingTables:", existingTables);
    // console.log(">>> [checkTables] missingTables:", missingTables);
    // console.log(">>> [checkTables] finalizado");

    console.log(`Fim do check de Tabelas do BD "${database}"`);

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

