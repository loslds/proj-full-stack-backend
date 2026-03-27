
//C:\repository\proj-full-stack-backend\src\use-cases\visitante\index.ts

// C:\repository\proj-full-stack-backend\src\use-cases\visitante\index.ts
import { VisitantesRepository } from './visitantes.repository';

export { VisitantesController } from './visitantes.controller';
export { VisitantesEntity } from './visitantes.entity';
export { VisitantesRepository } from './visitantes.repository';
export { visitantesRoutes } from './visitantes.route';

export * from './visitantes.dto';
export * from './visitantes.validation';

export const visitantesConfig = {
  tableName: 'visitantes',
  repoClass: VisitantesRepository,
  findAll: 'findVisitantesAll'
};