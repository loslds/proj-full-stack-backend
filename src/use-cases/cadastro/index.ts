
//use-cases/consumidor/index.ts

import { ClientesRepository } from './cadastros.repository';

export { clientesRoutes } from './cadastros.route';
export { ClientesController } from './cadastros.controller';
export type { ClientesDto } from './cadastros.dto';
export { ClientesEntity } from './cadastros.entity';
export { ClientesRepository } from './cadastros.repository';
export * from './cadastros.dto';
export * from './cadastros.validation';

export const clientesConfig = {
  tableName: 'clientes',
  repoClass: ClientesRepository,
  createMethod: 'createNotExistsClientes',
  findAll: 'findClientesAll',
  //insertDefaults: 'insertDefaultImagens',
};