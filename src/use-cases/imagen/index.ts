import { ImagensRepository } from './imagens.repository';


// C:\repository\proj-full-stack-backend\src\use-cases\imagen\index.ts
export { ImagensController } from './imagens.controller';
export type { ImagensDto } from './imagens.dto';
export { imagensRoutes } from './imagens.route'
export { ImagensEntity } from './imagens.entity';
export { ImagensRepository } from './imagens.repository';
export * from './imagens.dto';
export * from './imagens.validation';
export { initImagensRoutes } from './initImagensRoutes';

export const imagensConfig = {
  tableName: 'imagens',
  repoClass: ImagensRepository,
  createMethod: 'createNotExistsImagens',
  findAll: 'findImagensAll',
  insertDefaults: 'insertDefaultImagens',
};