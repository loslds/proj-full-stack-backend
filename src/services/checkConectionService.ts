
// src/use-cases/start/checkConnectionService.ts
import { AppDataSource } from "../config/db";
export interface CheckConnectionResult {
  success: boolean;
}

export async function checkConnectionService(): Promise<CheckConnectionResult> {
  try {
    // O DataSource deve ser inicializado no index.ts
    if (!AppDataSource.isInitialized) {
      throw new Error("DataSource não inicializado");
    }

    // Query mínima apenas para validar a conexão
    await AppDataSource.query("SELECT 1");

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao verificar conexão com o banco de dados:", error);
    return { success: false };
  }
}
