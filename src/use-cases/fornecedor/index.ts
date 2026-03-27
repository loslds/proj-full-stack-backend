

// C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\index.ts

import { FornecedoresRepository } from './fornecedores.repository';

export { FornecedoresController } from './fornecedores.controller';
export { FornecedoresEntity } from './fornecedores.entity';
export { FornecedoresRepository } from './fornecedores.repository';
export { fornecedoresRoutes } from './fornecedores.route';

export * from './fornecedores.dto';
export * from './fornecedores.validation';

export const fornecedoresConfig = {
  tableName: 'fornecedores',
  repoClass: FornecedoresRepository,
  findAll: 'findFornecedoresAll'
};