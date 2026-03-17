
//C:\repository\proj-full-stack-backend\src\use-cases\cargo\index.ts
import { CargosRepository } from './cargos.repository';

export { CargosController } from './cargos.controller';
export { CargosEntity } from './cargos.entity';
export { CargosRepository } from './cargos.repository';
export { cargosRoutes } from './cargos.route';

export * from './cargos.dto';
export * from './cargos.validation';

export const cargosConfig = {
  tableName: 'cargos',
  repoClass: CargosRepository,
  findAll: 'findCargosAll'
};