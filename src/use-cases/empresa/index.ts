import { EmpresasRepository } from './empresas.repository';

//use-cases/empresa/index.ts
export { empresasRoute } from './empresas.route';
export { EmpresasController } from './empresas.controller';
export type { EmpresasDto } from './empresas.dto';
export { EmpresasEntity } from './empresas.entity';
export { EmpresasRepository } from './empresas.repository';
export * from './empresas.dto';
export * from './empresas.validation';

export const empresasConfig = {
  tableName: 'empresas',
  repoClass: EmpresasRepository,
  createMethod: 'createNotExistsEmpresas',
  findAll: 'findEmpresasAll',
  //insertDefaults: 'insertDefaultImagens',
};