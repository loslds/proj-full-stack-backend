// src/use-cases/start/checkConnectionService.ts
import { AppDataSource } from '../config/db';

export async function checkConnectionService(): Promise<{ success: boolean }> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Query simples para validar a conexão
    await AppDataSource.query('SELECT 1');

    return { success: true };
  } catch (error) {
    console.error('Erro ao verificar conexão com o banco:', error);
    return { success: false };
  }
}
