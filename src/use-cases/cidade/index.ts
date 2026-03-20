
  
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\index.ts
import { CidadesRepository } from './cidades.repository';

export { cidadesRoutes } from './cidades.route';
export { CidadesController } from './cidades.controller';
export { CidadesEntity } from './cidades.entity';
export { CidadesRepository } from './cidades.repository';

export * from './cidades.dto';
export * from './cidades.validation';

export const cidadesConfig = {
  tableName: 'cidades',
  repoClass: CidadesRepository,
  findAll: 'findCidadesAll'
};


