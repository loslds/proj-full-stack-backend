
// C:\repository\proj-full-stack-backend\src\use-cases\consumidor\index.ts
import { ConsumidoresRepository } from './consumidores.repository';

export { ConsumidoresController } from './consumidores.controller';
export { ConsumidoresEntity } from './consumidores.entity';
export { ConsumidoresRepository } from './consumidores.repository';
export { consumidoresRoutes } from './consumidores.route';


export * from './consumidores.dto';
export * from './consumidores.validation';

export const consumidoresConfig = {
  tableName: 'consumidores',
  repoClass: ConsumidoresRepository,
  findAll: 'findConsumidoresAll'
};

