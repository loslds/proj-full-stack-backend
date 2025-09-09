
// src/use-cases/start/checkConnectionService.ts
import { dbSource } from "../use-cases/start/dbSource";

export async function checkConnectionService(): Promise<{ success: boolean }> {
  try {
    if (!dbSource.isInitialized) {
      await dbSource.initialize();
    }
    // Tenta fazer uma query simples pra garantir conexão
    await dbSource.query("SELECT 1");
    return { success: true };
  } catch (err) {
    console.error("Erro ao verificar conexão:", err);
    return { success: false };
  }
}
