
// C:\repository\proj-full-stack-backend\src\use-cases\estado\index.ts

import { EstadosRepository } from './estados.repository';

export { EstadosController } from './estados.controller';
export { EstadosEntity } from './estados.entity';
export { EstadosRepository } from './estados.repository';
export { estadosRoutes } from './estados.route';

export * from './estados.dto';
export * from './estados.validation';

export const estadosConfig = {
  tableName: 'estados',
  repoClass: EstadosRepository,
  findAll: 'findEstadosAll'
};