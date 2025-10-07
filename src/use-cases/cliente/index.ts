
//use-cases/consumidor/index.ts

import { ClientesRepository } from './clientes.repository';

export { clientesRoutes } from './clientes.route';
export { ClientesController } from './clientes.controller';
export type { ClientesDto } from './clientes.dto';
export { ClientesEntity } from './clientes.entity';
export { ClientesRepository } from './clientes.repository';
export * from './clientes.dto';
export * from './clientes.validation';

export const clientesConfig = {
  tableName: 'clientes',
  repoClass: ClientesRepository,
  createMethod: 'createNotExistsClientes',
  findAll: 'findClientesAll',
  //insertDefaults: 'insertDefaultImagens',
};