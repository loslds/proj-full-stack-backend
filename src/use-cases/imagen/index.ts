
// C:\repository\proj-full-stack-backend\src\use-cases\imagen\index.ts
export { ImagensController } from './imagens.controller';
export { ImagensEntity } from './imagens.entity';
export { ImagensRepository } from './imagens.repository';

export * from './imagens.dto';
export * from './imagens.validation';
// ROTAS -. SERVIDOR E FRONTEND
export { imagensRoutes } from './imagens.route';
//
import { ImagensRepository } from './imagens.repository';
export const imagensConfig = {
  tableName: 'imagens',
  repoClass: ImagensRepository,
  createMethod: 'createNotExistsImagens',
  findAll: 'findImagensAll',
  insertDefaults: 'insertDefaultImagens'
};
