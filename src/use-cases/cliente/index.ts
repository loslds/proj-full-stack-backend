
// C:\repository\proj-full-stack-backend\src\use-cases\consumidor\index.ts

import { ClientesRepository } from './clientes.repository';

export { ClientesController } from './clientes.controller';
export { ClientesEntity } from './clientes.entity';
export { ClientesRepository } from './clientes.repository';
export { clientesRoutes } from './clientes.route';

export * from './clientes.dto';
export * from './clientes.validation';

export const clientesConfig = {
  tableName: 'clientes',
  repoClass: ClientesRepository,
  findAll: 'findClientesAll'
};