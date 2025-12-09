
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\index.ts


export { PessoasController } from './pessoas.controller';
export { PessoasEntity } from './pessoas.entity';
export { PessoasRepository } from './pessoas.repository';

export * from './pessoas.dto';
export * from './pessoas.validation';
// ROTAS -. SERVIDOR E FRONTEND
export { initPessoasRoutes } from './initPessoasRoutes';
export { pessoasRoutes } from './pessoas.route';
//
import { PessoasRepository } from './pessoas.repository';
export const pessoasConfig = {
  tableName: 'pessoas',
  repoClass: PessoasRepository,
  createMethod: 'createNotExistsPessoas',
  findAll: 'findPessoasAll',
  insertDefaults: 'insertDefaultPessoas',
};






