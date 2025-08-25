 
 // src/user-case/start/dbSouce.ts
import { DataSource } from 'typeorm';
import { configDB } from '../../config/db';
import { dbEntity } from './dbEntity';

export const dbSource = new DataSource({
  type: 'mysql',
  host: configDB.host,
  port: configDB.port,
  username: configDB.username,
  password: configDB.password,
  database: configDB.database,
  entities: dbEntity,
  synchronize: true,
});



