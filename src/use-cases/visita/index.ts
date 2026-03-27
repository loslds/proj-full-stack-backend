
// C:\repository\proj-full-stack-backend\src\use-cases\visita\index.ts
import { VisitasRepository } from './visitas.repository';

export { VisitasController } from './visitas.controller';
export { VisitasEntity } from './visitas.entity';
export { VisitasRepository } from './visitas.repository';
export { visitasRoutes } from './visitas.route';

export * from './visitas.dto';
export * from './visitas.validation';

export const visitasConfig = {
  tableName: 'visitas',
  repoClass: VisitasRepository,
  findAll: 'findVisitasAll'
};