
// C:\repository\proj-full-stack-backend\src\use-cases\pergresp\index.ts

import { PergsrespsRepository } from './pergsresps.repository';

export { PergsrespsController } from './pergsresps.controller';
export { PergsrespsEntity } from './pergsresps.entity';
export { PergsrespsRepository } from './pergsresps.repository';
export { pergsrespsRoutes } from './pergsresps.route';

export * from './pergsresps.dto';
export * from './pergsresps.validation';

export const pergsrespsConfig = {
  tableName: 'pergsresps',
  repoClass: PergsrespsRepository,
  findAll: 'findPergsrespsAll'
};