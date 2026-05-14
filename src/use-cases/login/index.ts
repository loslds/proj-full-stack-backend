
// C:\repository\proj-full-stack-backend\src\use-cases\login\index.ts

import { LoginsRepository } from "./logins.repository";
export { LoginsController } from "./logins.controller";
export { LoginsEntity } from "./logins.entity";
export { LoginsRepository } from "./logins.repository";
export { loginsRoutes } from "./logins.route";


export * from './logins.dto';
export * from './logins.validation';

export const loginsConfig = {
  tableName: 'logins',
  repoClass: LoginsRepository,
  findAll: 'findLoginsAll'
};