// C:\repository\proj-full-stack-backend\src\use-cases\arquivado\index.ts

import { ArquivadosRepository } from './arquivados.repository';

export { ArquivadosController } from './arquivados.controller';
export { ArquivadosEntity } from './arquivados.entity';
export { ArquivadosRepository } from './arquivados.repository';
export { arquivadosRoutes } from './arquivados.route';

export * from './arquivados.dto';
export * from './arquivados.validation';

export const arquivadosConfig = {
  tableName: 'arquivados',
  repoClass: ArquivadosRepository,
  findAll: 'findArquivadosAll'
};
