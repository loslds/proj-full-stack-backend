
//C:\repository\proj-full-stack-backend\src\use-cases\perguntas\perguntas.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { PerguntasController } from './perguntas.controller';
import { PerguntasRepository } from './perguntas.repository';
import {
  perguntasCreateValidation,
  perguntasUpdateValidation
} from './perguntas.validation';

const perguntasRepository = new PerguntasRepository(AppDataSource);
const controller = new PerguntasController(perguntasRepository);
const perguntasRoute = Router();

// ==========================================================
// ROTAS FIXAS
// ==========================================================

perguntasRoute.get('/', controller.findAllPerguntas.bind(controller));
perguntasRoute.get('/search', controller.searchPerguntasAll.bind(controller));
perguntasRoute.get('/search-nome', controller.searchPerguntasNome.bind(controller));
perguntasRoute.get('/one-nome', controller.findOnePerguntasNome.bind(controller));
perguntasRoute.get('/all-nome', controller.findAllPerguntasNome.bind(controller));

perguntasRoute.post(
  '/',
  perguntasCreateValidation,
  controller.createNewPerguntas.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

perguntasRoute.get('/:perguntasId', controller.getOnePerguntasId.bind(controller));

perguntasRoute.patch(
  '/:perguntasId',
  perguntasUpdateValidation,
  controller.updateIdPerguntas.bind(controller)
);

perguntasRoute.delete('/:perguntasId', controller.removeIdPerguntas.bind(controller));

export { perguntasRoute as perguntasRoutes };