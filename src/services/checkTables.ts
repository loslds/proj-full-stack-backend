// src/services/checkTables.ts
import { requiredTables } from '../config/tables';
import { dbSource } from '../database';

export async function checkTables(): Promise<{
  success: boolean;
  missingTables?: string[];
  checkedTables?: string[];
  message: string;
}> {
  try {
    const queryRunner = dbSource.createQueryRunner();
    await queryRunner.connect();

    const tables = await queryRunner.query('SHOW TABLES');
    const existingTables = tables.map((table: any) => Object.values(table)[0]);

    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    const checkedTables = requiredTables.filter(t => existingTables.includes(t));

    await queryRunner.release();

    return {
      success: missingTables.length === 0,
      missingTables,
      checkedTables,
      message: missingTables.length > 0
        ? `❌ Tabelas faltando: ${missingTables.join(', ')}`
        : '✅ Todas as tabelas estão presentes!'
    };
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    return { success: false, message: '❌ Erro ao verificar tabelas' };
  }
}
