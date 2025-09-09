 
// C:\repository\proj-full-stack-backend\src\services\syncsysTables.ts
import { dbSource } from '../use-cases/start/dbSource';
export interface TableStatus {
  table_name: string;
  exists: boolean;
}

export async function syncsysTables(requiredTables: string[]): Promise<TableStatus[]> {
  if (!dbSource.isInitialized) {
    await dbSource.initialize();
  }

  const queryRunner = dbSource.createQueryRunner();
  await queryRunner.connect();

  const results: TableStatus[] = [];

  try {
    for (const table of requiredTables) {
      // Checa se a tabela existe no banco
      const [rows]: any = await queryRunner.query(
        `SHOW TABLES LIKE ?`, [table]
      );

      const exists = rows.length > 0;

      // Atualiza ou insere na tabela systables
      const [existingEntry]: any = await queryRunner.query(
        `SELECT * FROM systables WHERE table_name = ?`, [table]
      );

      if (existingEntry) {
        await queryRunner.query(
          `UPDATE systables SET chkdb = ? WHERE table_name = ?`,
          [exists ? 1 : 0, table]
        );
      } else {
        await queryRunner.query(
          `INSERT INTO systables (table_name, chkdb) VALUES (?, ?)`,
          [table, exists ? 1 : 0]
        );
      }

      results.push({ table_name: table, exists });
    }

    return results;
  } catch (error) {
    console.error('Erro ao sincronizar systables:', error);
    throw new Error('Falha na sincronização das tabelas do sistema.(systables)');
  } finally {
    await queryRunner.release();
  }
}

