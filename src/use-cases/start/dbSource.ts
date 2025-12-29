 // src/use-case/start/dbSource.ts
import { AppDataSource } from '../../config/db';

export async function initDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}


