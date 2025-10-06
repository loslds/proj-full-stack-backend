
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\index.ts
import { PessoasRepository } from './pessoas.repository';

export { PessoasController } from './pessoas.controller';
export type { PessoasDto } from './pessoas.dto';
export { pessoasRoutes } from './pessoas.route'
export { PessoasEntity } from './pessoas.entity';
export { PessoasRepository } from './pessoas.repository';
export * from './pessoas.dto';
export * from './pessoas.validation';

export { initPessoasRoutes } from './initPessoasRoutes';

export const pessoasConfig = {
  tableName: 'pessoas',
  repoClass: PessoasRepository,
  createMethod: 'createNotExistsPessoas',
  findAll: 'findPessoasAll',
  insertDefaults: 'insertDefaultPessoas',
};






