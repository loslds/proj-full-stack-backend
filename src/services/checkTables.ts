 // src/services/checkTables.ts
import { AppDataSource } from "../config/db";
import { systemTables } from "./tables/tables";

export interface CheckTablesResult {
  existingTables: string[];
  missingTables: string[];
  records: Record<string, number>;
}

export async function checkTables(): Promise<CheckTablesResult> {
  if (!AppDataSource.isInitialized) {
    throw new Error("DataSource não inicializado");
  }

  const queryRunner = AppDataSource.createQueryRunner();

  const existingTables: string[] = [];
  const missingTables: string[] = [];
  const records: Record<string, number> = {};

  try {
    await queryRunner.connect();

    const tables = await queryRunner.query("SHOW TABLES");
    const dbTables = tables.map((t: any) => Object.values(t)[0]);

    for (const table of systemTables) {
      if (!dbTables.includes(table)) {
        missingTables.push(table);
        continue;
      }

      existingTables.push(table);

      try {
        const result = await queryRunner.query(
          `SELECT COUNT(*) as total FROM \`${table}\``
        );
        records[table] = result[0]?.total ?? 0;
      } catch {
        records[table] = 0;
      }
    }

    return { existingTables, missingTables, records };
  } finally {
    await queryRunner.release();
  }
}
 