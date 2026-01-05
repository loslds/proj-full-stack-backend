 
// src/services/checkTables.ts
import { AppDataSource } from '../config/db';
import { systemTables } from '../system/tables';
import { systablesConfig } from '../use-cases/systable';

type TableConfig = {
  tableName: string;
  repoClass: any;
  createMethod: string;
  findAll: string;
};

const tablesMap: Record<string, TableConfig> = {
  systables: systablesConfig,
};


export interface CheckTablesResult {
  existingTables: string[];
  missingTables: string[];
  records: Record<string, number>;
}
export async function checkTables(): Promise<CheckTablesResult> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  const existingTables: string[] = [];
  const missingTables: string[] = [];
  const records: Record<string, number> = {};

  try {
    await queryRunner.connect();

    const tables = await queryRunner.query('SHOW TABLES');
    const dbTables = tables.map((t: any) => Object.values(t)[0]);

    for (const table of systemTables) {
      const config = tablesMap[table];

      if (!config) {
        throw new Error(`Configuração inexistente para ${table}`);
      }

      const repo = new config.repoClass(AppDataSource);

      if (!dbTables.includes(table)) {
        missingTables.push(table);
        await repo[config.createMethod](); // cria tabela
      } else {
        existingTables.push(table);
      }

      const count = (await repo[config.findAll]({})).length;
      records[table] = count;
    }

    return { existingTables, missingTables, records };
  } finally {
    await queryRunner.release();
  }
}

