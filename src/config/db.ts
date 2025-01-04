import 'dotenv/config';

export const configDB = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process?.env?.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'jrbordados',
};

export const urlDB = `mysql://${configDB.username}:${configDB.password}@${configDB.host}:${configDB.port}/${configDB.database}`;
