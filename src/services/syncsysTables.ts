 
// src/services/syncsysTables.ts
import { AppDataSource } from '../config/db';
import { systemTables } from '../system/tables';
import { QueryRunner } from 'typeorm';

export interface TableStatus {
  table: string;
  exists: boolean;
  numberRegs: number;
}

export async function syncsysTables(): Promise<TableStatus[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const results: TableStatus[] = [];

  try {
    for (const table of systemTables) {
      // 1️⃣ Verifica se a tabela existe
      const tableRows: any[] = await queryRunner.query(
        `SHOW TABLES LIKE ?`,
        [table]
      );

      const exists = tableRows.length > 0;

      // 2️⃣ Conta registros (somente se existir)
      const numberRegs = exists
        ? await getRowCount(queryRunner, table)
        : 0;

      // 3️⃣ Verifica se já existe registro na systables
      const systableRows: any[] = await queryRunner.query(
        `SELECT id FROM systables WHERE nome = ? LIMIT 1`,
        [table]
      );

      if (systableRows.length > 0) {
        // UPDATE
        await queryRunner.query(
          `
          UPDATE systables
             SET chkdb = ?,
                 numberregs = ?,
                 updatedAt = NOW()
           WHERE nome = ?
          `,
          [exists ? 1 : 0, numberRegs, table]
        );
      } else {
        // INSERT
        await queryRunner.query(
          `
          INSERT INTO systables (nome, chkdb, numberregs, createdAt, updatedAt)
          VALUES (?, ?, ?, NOW(), NOW())
          `,
          [table, exists ? 1 : 0, numberRegs]
        );
      }

      results.push({
        table,
        exists,
        numberRegs
      });
    }

    return results;
  } catch (error) {
    console.error('❌ Erro ao sincronizar systables:', error);
    throw new Error('Falha na sincronização das tabelas do sistema (systables).');
  } finally {
    try {
      await queryRunner.release();
    } catch {
      /* noop */
    }
  }
}

// ==============================
// Auxiliar
// ==============================
async function getRowCount(
  queryRunner: QueryRunner,
  table: string
): Promise<number> {
  const rows: any[] = await queryRunner.query(
    `SELECT COUNT(*) AS cnt FROM \`${table}\``
  );
  return rows?.[0]?.cnt ?? 0;
}
