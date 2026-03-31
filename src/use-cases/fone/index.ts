
// C:\repository\proj-full-stack-backend\src\use-cases\fone\index.ts
import { FonesRepository } from './fones.repository';

export { FonesController } from './fones.controller';
export { FonesEntity } from './fones.entity';
export { FonesRepository } from './fones.repository';
export { fonesRoutes } from './fones.route';

export * from './fones.dto';
export * from './fones.validation';

export const fonesConfig = {
  tableName: 'fones',
  repoClass: FonesRepository,
  findAll: 'findFonesAll'
};
