

// C:\repository\proj-full-stack-backend\src\use-cases\doc\index.ts
import { DocsRepository } from './docs.repository';

export { DocsController } from './docs.controller';
export { DocsEntity } from './docs.entity';
export { DocsRepository } from './docs.repository';
export { docsRoutes } from './docs.route';

export * from './docs.dto';
export * from './docs.validation';

export const docsConfig = {
  tableName: 'docs',
  repoClass: DocsRepository,
  findAll: 'findDocsAll'
};
