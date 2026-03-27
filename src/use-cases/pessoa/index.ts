
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\index.ts

import { PessoasRepository } from './pessoas.repository';

export { PessoasController } from './pessoas.controller';
export { PessoasEntity } from './pessoas.entity';
export { PessoasRepository } from './pessoas.repository';
export { pessoasRoutes } from './pessoas.route';

export * from './pessoas.dto';
export * from './pessoas.validation';

export const pessoasConfig = {
  tableName: 'pessoas',
  repoClass: PessoasRepository,
  findAll: 'findPessoasAll'
};
