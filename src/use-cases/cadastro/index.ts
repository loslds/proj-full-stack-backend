
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\index.ts
import { CadastrosRepository } from './cadastros.repository';

export { CadastrosController } from './cadastros.controller';
export { CadastrosEntity } from './cadastros.entity';
export { CadastrosRepository } from './cadastros.repository';
export { cadastrosRoutes } from './cadastros.route';

export * from './cadastros.dto';
export * from './cadastros.validation';

export const cadastrosConfig = {
  tableName: 'cadastros',
  repoClass: CadastrosRepository,
  findAll: 'findCadastrosAll'
};

