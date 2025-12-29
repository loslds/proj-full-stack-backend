 
// src/services/syncsysTables.ts
import { dbSource } from '../use-cases/start/dbSource';
import { requiredTables } from '../config/tables';

export interface TableStatus {
  table_name: string;
  exists: boolean;
}

export async function syncsysTables(): Promise<TableStatus[]> {
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

      // Atualiza ou insere na tabela systables usando a coluna 'nome'
      const [existingEntry]: any = await queryRunner.query(
        `SELECT * FROM systables WHERE nome = ?`, [table]
      );

      if (existingEntry) {
        await queryRunner.query(
          `UPDATE systables SET chkdb = ?, numberregs = ? WHERE nome = ?`,
          [exists ? 1 : 0, exists ? await getRowCount(queryRunner, table) : 0, table]
        );
      } else {
        await queryRunner.query(
          `INSERT INTO systables (nome, chkdb, numberregs) VALUES (?, ?, ?)`,
          [table, exists ? 1 : 0, exists ? await getRowCount(queryRunner, table) : 0]
        );
      }

      results.push({ table_name: table, exists });
    }

    return results;
  } catch (error) {
    console.error('Erro ao sincronizar systables:', error);
    throw new Error('Falha na sincronização das tabelas do sistema (systables).');
  } finally {
    await queryRunner.release();
  }
}

// Função auxiliar para contar registros de uma tabela
async function getRowCount(queryRunner: any, table: string): Promise<number> {
  const [result]: any = await queryRunner.query(`SELECT COUNT(*) AS count FROM ??`, [table]);
  return result?.count || 0;
}
