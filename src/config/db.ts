
//C:\repository\proj-full-stack-backend\src\config\db.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { dbEntity } from '../entities/dbEntity';

/**
 * Configuração central do banco de dados
 */
export const dbConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '123456',
  database: process.env.DB_NAME ?? 'sgb',
  charset: 'utf8mb4',
};

/**
 * URL opcional (logs, debug, futuras migrations)
 */
export const dbUrl = `mysql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

/**
 * 🔴 ÚNICO DataSource DO SISTEMA
 * Usado tanto na instalação quanto na operação normal
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: dbEntity,
  charset: dbConfig.charset,
  synchronize: false, // ❗ controle TOTAL via services
  logging: false,
});



// export const configDB = {
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process?.env?.DB_PORT || 3306),
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '123456',
//   database: process.env.DB_NAME || 'jrbordados',
//   charset: 'utf8mb4', // ✅ define utf8mb4 corretamente
// };
