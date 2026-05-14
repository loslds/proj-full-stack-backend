
// C:\repository\proj-full-stack-backend\src\use-cases\acesso\index.ts

import { AcessosRepository } from './acessos.repository';

export { AcessosController } from './acessos.controller';
export { AcessosEntity } from './acessos.entity';
export { AcessosRepository } from './acessos.repository';
export { acessosRoutes } from './acessos.route';

export * from './acessos.dto';
export * from './acessos.validation';

export const acessosConfig = {
  tableName: 'acessos',
  repoClass: AcessosRepository,
  findAll: 'findAcessosAll'
};