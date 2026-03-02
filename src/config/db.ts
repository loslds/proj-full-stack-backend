
//C:\repository\proj-full-stack-backend\src\config\db.ts
import 'dotenv/config';

import { DataSource } from 'typeorm';
import { SystablesEntity } from '../use-cases/systable/systables.entity';

export const dbConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '123456',
  database: process.env.DB_NAME ?? 'sgb',
  charset: 'utf8mb4',
};

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '123456',
  database: process.env.DB_NAME ?? 'sgb',
  charset: 'utf8mb4',

  // ⚠️ SOMENTE a entity mínima do sistema
  entities: [SystablesEntity],
  synchronize: false,
  logging: false,
});
