
//C:\repository\proj-full-stack-backend\src\use-cases\perguntas\index.ts
import { PerguntasRepository } from './perguntas.repository';

export { PerguntasController } from './perguntas.controller';
export { PerguntasEntity } from './perguntas.entity';
export { PerguntasRepository } from './perguntas.repository';
export { perguntasRoutes } from './perguntas.route';

export * from './perguntas.dto';
export * from './perguntas.validation';

export const perguntasConfig = {
  tableName: 'perguntas',
  repoClass: PerguntasRepository,
  findAll: 'findPerguntasAll'
};