
// C:\repository\proj-full-stack-backend\src\use-cases\chave\index.ts

import { ChavesRepository } from './chaves.repository';
export { ChavesController } from './chaves.controller';
export { ChavesEntity } from './chaves.entity';
export { ChavesRepository } from './chaves.repository';
export { chavesRoutes } from './chaves.route';

export * from './chaves.dto';
export * from './chaves.validation';

export const chavesConfig = {
  tableName: 'chaves',
  repoClass: ChavesRepository,
  findAll: 'findChavesAll'
};

