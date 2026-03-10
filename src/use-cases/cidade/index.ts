
// src/use-cases/cidades/index.ts

export { cidadesRoutes } from './cidades.route';
export { CidadesController } from './cidades.controller';
export { CidadesEntity } from './cidades.entity';
export { CidadesRepository } from './cidades.repository';

export * from './cidades.dto';
export * from './cidades.validation';

import { CidadesRepository } from './cidades.repository';

export const cidadesConfig = {
  tableName: 'cidades',
  repoClass: CidadesRepository,
  createMethod: 'createNotExistsCidades',
  findAll: 'findCidadesAll',
  insertDefaults: 'insertDefaultCidades',
};
