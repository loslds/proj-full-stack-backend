
// C:\repository\proj-full-stack-backend\src\use-cases\systable\index.ts
export { systableRoute } from './systables.route';
export { SystablesController } from './systables.controller';
export { SystablesEntity } from './systables.entity';
export { SystablesRepository } from './systables.repository';

export * from './systables.dto';
export * from './systables.validation';

import { SystablesRepository } from './systables.repository';
export const systablesConfig = {
  tableName: 'systables',
  repoClass: SystablesRepository,
  createMethod: 'createNotExistsSystables',
  findAll: 'findSystablesAll',
};

