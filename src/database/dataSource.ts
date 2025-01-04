import { DataSource } from 'typeorm';
import { configDB } from '../config/db';
import { entities } from './entities';

export const dataSource = new DataSource({
  type: 'mysql',
  host: configDB.host,
  port: configDB.port,
  username: configDB.username,
  password: configDB.password,
  database: configDB.database,
  entities,
  synchronize: true,
});
