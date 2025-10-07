
//use-cases/consumidor/index.ts

import { FornecedoresRepository } from './fornecedores.repository';

export { fornecedoresRoutes } from './fornecedores.route';
export { FornecedoresController } from './fornecedores.controller';
export type { FornecedoresDto } from './fornecedores.dto';
export { FornecedoresEntity } from './fornecedores.entity';
export { FornecedoresRepository } from './fornecedores.repository';
export * from './fornecedores.dto';
export * from './fornecedores.validation';

export const fornecedoresConfig = {
  tableName: 'fornecedores',
  repoClass: FornecedoresRepository,
  createMethod: 'createNotExistsFornecedores',
  findAll: 'findFornecedoresAll',
  //insertDefaults: 'insertDefaultImagens',
};