  
 // src/use-cases/start/checkDatabases.ts
import { dbSource } from './dbSource';

export async function checkTables(): Promise<{ success: boolean; message: string }> {
  try {
    const queryRunner = dbSource.createQueryRunner();
    await queryRunner.connect();

    // Lista todas as tabelas do banco
    const tables = await queryRunner.query('SHOW TABLES');
    queryRunner.release();

    // 🔹 Liste as tabelas que o sistema precisa
    const requiredTables = [
      'systable',
      'pessoas',
      'empresas',
    ]; 
    const existingTables = tables.map((table: any) => Object.values(table)[0]);

    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      return { success: false, message: `❌ Tabelas faltando: ${missingTables.join(', ')}` };
    }

    return { success: true, message: '✅ Todas as tabelas estão presentes!' };
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    return { success: false, message: '❌ Erro ao verificar tabelas' };
  }
}

