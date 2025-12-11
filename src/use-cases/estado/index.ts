// C:\repository\proj-full-stack-backend\src\use-cases\estdos\index.ts
export { EstadosController } from './estados.controller';
export { EstadosEntity } from './estados.entity';
export { EstadosRepository } from './estados.repository';

export * from './estados.dto';
export * from './estados.validation';
// ROTAS -. SERVIDOR E FRONTEND
export { initEstadosRoutes } from './initEstadosRoutes';
export { estadosRoutes } from './estados.route'
//
import { EstadosRepository } from './estados.repository';
export const estadosConfig = {
  tableName: 'estados',
  repoClass: EstadosRepository,
  createMethod: 'createNotExistsEstados',
  findAll: 'findEstadosAll',
  insertDefaults: 'insertDefaultEstados',
};

