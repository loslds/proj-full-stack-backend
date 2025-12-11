
//C:\repository\proj-full-stack-backend\src\use-cases\cadastro\index.ts
export { cadastrosRoutes } from './cadastros.route';
export { CadastrosController } from './cadastros.controller';
export type { CadastrosDto } from './cadastros.dto';
export { CadastrosEntity } from './cadastros.entity';
export * from './cadastros.dto';
export * from './cadastros.validation';

import { CadastrosRepository } from './cadastros.repository';
export const cadasrosConfig = {
  tableName: 'cadastros',
  repoClass: CadastrosRepository,
  createMethod: 'createNotExistsClientes',
  findAll: 'findCadastrosAll',
};




