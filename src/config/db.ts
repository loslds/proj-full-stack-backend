
//C:\repository\proj-full-stack-backend\src\config\db.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { dbEntity } from '../entities/dbEntity'; // caminho para seu array de entities

export const configDB = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process?.env?.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'jrbordados',
  charset: 'utf8mb4', // ✅ define utf8mb4 corretamente
};

// Cria URL caso queira usar em outro lugar
export const urlDB = `mysql://${configDB.username}:${configDB.password}@${configDB.host}:${configDB.port}/${configDB.database}`;

// DataSource do TypeORM
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configDB.host,
  port: configDB.port,
  username: configDB.username,
  password: configDB.password,
  database: configDB.database,
  synchronize: true, // cuidado em produção
  logging: false,
  entities: dbEntity, // ✅ aqui você usa seu array de entities
  charset: configDB.charset, // ✅ aplica utf8mb4
});


