
// C:\repository\proj-full-stack-backend\src\use-cases\servico\index.ts

import { ServicosRepository } from './servicos.repository';


export { ServicosController } from './servicos.controller';
export { ServicosEntity } from './servicos.entity';
export { ServicosRepository } from './servicos.repository';
export { servicosRoutes } from './servicos.route';


export * from './servicos.dto';
export * from './servicos.validation';


export const servicosConfig = {
  tableName: 'servicos',
  repoClass: ServicosRepository,
  findAll: 'findServicosAll'
};