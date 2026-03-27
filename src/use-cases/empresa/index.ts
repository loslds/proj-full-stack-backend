
// C:\repository\proj-full-stack-backend\src\use-cases\empresa\index.ts

import { EmpresasRepository } from './empresas.repository';

export { EmpresasController } from './empresas.controller';
export { EmpresasEntity } from './empresas.entity';
export { EmpresasRepository } from './empresas.repository';
export { empresasRoutes } from './empresas.route';

export * from './empresas.dto';
export * from './empresas.validation';

export const empresasConfig = {
  tableName: 'empresas',
  repoClass: EmpresasRepository,
  findAll: 'findEmpresasAll'
};

