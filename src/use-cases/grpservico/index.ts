
// C:\repository\proj-full-stack-backend\src\use-cases\grpservico\index.ts

import { GrpServicosRepository } from './grpservicos.repository';


export { GrpServicosController } from './grpservicos.controller';
export { GrpServicosEntity } from './grpservicos.entity';
export { GrpServicosRepository } from './grpservicos.repository';
export { grpservicosRoutes } from './grpservicos.route';


export * from './grpservicos.dto';
export * from './grpservicos.validation';


export const grpservicosConfig = {
  tableName: 'grpservicos',
  repoClass: GrpServicosRepository,
  findAll: 'findGrpServicosAll'
};