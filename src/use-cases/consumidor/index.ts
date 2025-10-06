
//use-cases/consumidor/index.ts

import { ConsumidoresRepository } from './consumidores.repository';

export { consumidoresRoutes } from './consumidores.route';
export { ConsumidoresController } from './consumidores.controller';
export type { ConsumidoresDto } from './consumidores.dto';
export { ConsumidoresEntity } from './consumidores.entity';
export { ConsumidoresRepository } from './consumidores.repository';
export * from './consumidores.dto';
export * from './consumidores.validation';

export const consumidoresConfig = {
  tableName: 'consumidores',
  repoClass: ConsumidoresRepository,
  createMethod: 'createNotExistsConsumidores',
  findAll: 'findConsumidoresAll',
  //insertDefaults: 'insertDefaultImagens',
};