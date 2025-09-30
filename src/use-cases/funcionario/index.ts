//use-cases/empresa/index.ts

import { FuncionariosRepository } from './funcionarios.repository';

export { funcionariosRoute } from './funcionarios.route';
export { FuncionariosController } from './funcionarios.controller';
export type { FuncionariosDto } from './funcionarios.dto';
export { FuncionariosEntity } from './funcionarios.entity';
export { FuncionariosRepository } from './funcionarios.repository';
export * from './funcionarios.dto';
export * from './funcionarios.validation';

export const funcionariosConfig = {
  tableName: 'funcionarios',
  repoClass: FuncionariosRepository,
  createMethod: 'createNotExistsFuncionarios',
  findAll: 'findFuncionariosAll',
  //insertDefaults: 'insertDefaultImagens',
};