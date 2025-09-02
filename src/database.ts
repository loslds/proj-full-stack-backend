
// src/database.ts
import { DataSource } from 'typeorm';
import { configDB } from './config/db';
import { dbEntity } from './entities/dbEntity';

export const dbSource = new DataSource({
  type: 'mysql',
  host: configDB.host,
  port: configDB.port,
  username: configDB.username,
  password: configDB.password,
  database: configDB.database,
  synchronize: true,  // cuidado em produção
  logging: false,
  entities: dbEntity,
  charset: configDB.charset,
});

