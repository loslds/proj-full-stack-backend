// C:\repository\proj-full-stack-backend\src\use-cases\modulo\index.ts

import { ModulosRepository } from './modulos.repository';

export { ModulosController } from './modulos.controller';
export { ModulosEntity } from './modulos.entity';
export { ModulosRepository } from './modulos.repository';
export { modulosRoutes } from './modulos.route';

export * from './modulos.dto';
export * from './modulos.validation';

export const modulosConfig = {
  tableName: 'modulos',
  repoClass: ModulosRepository,
  findAll: 'findModulosAll'
};