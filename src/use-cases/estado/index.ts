// C:\repository\proj-full-stack-backend\src\use-cases\estdos\index.ts

import { EstadosRepository } from './estados.repository';
export { EstadosController } from './estados.controller';
export type { EstadosDto } from './estados.dto';
export { estadosRoute } from './estados.route'
export { EstadosEntity } from './estados.entity';

export * from './estados.dto';
export * from './estados.validation';

export { initEstadosRoutes } from './initEstadosRoutes';

export const estadosConfig = {
  tableName: 'estados',
  repoClass: EstadosRepository,
  createMethod: 'createNotExistsEstados',
  findAll: 'findEstadosAll',
  insertDefaults: 'insertDefaultEstados',
};







