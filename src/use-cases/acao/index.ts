
// C:\repository\proj-full-stack-backend\src\use-cases\acao\index.ts

import { AcoesRepository } from './acoes.repository';

export { AcoesController } from './acoes.controller';
export { AcoesEntity } from './acoes.entity';
export { AcoesRepository } from './acoes.repository';
export { acoesRoutes } from './acoes.route';

export * from './acoes.dto';
export * from './acoes.validation';

export const acoesConfig = {
  tableName: 'acoes',
  repoClass: AcoesRepository,
  findAll: 'findAcoesAll'
};