
// C:\repository\proj-full-stack-backend\src\use-cases\funcionario\index.ts
import { FuncionariosRepository } from './funcionarios.repository';

export { FuncionariosController } from './funcionarios.controller';
export { FuncionariosEntity } from './funcionarios.entity';
export { FuncionariosRepository } from './funcionarios.repository';
export { funcionariosRoutes } from './funcionarios.router';

export * from './funcionarios.dto';
export * from './funcionarios.validation';

export const funcionariosConfig = {
  tableName: 'funcionarios',
  repoClass: FuncionariosRepository,
  findAll: 'findFuncionariosAll'
};