
//C:\repository\proj-full-stack-backend\src\use-cases\perguntas\perguntas.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { PerguntasController } from './perguntas.controller';
import { PerguntasRepository } from './perguntas.repository';
import {
  perguntascreateValidation,
  perguntasupdateValidation
} from './perguntas.validation';

const perguntasRepository = new PerguntasRepository(AppDataSource);
const controller = new PerguntasController(perguntasRepository);
const perguntasRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas com parâmetros dinâmicos
// ==========================================================

// GET -> Lista todas as perguntas
perguntasRoute.get(
  '/',
  controller.findAllPerguntas.bind(controller)
);

// GET -> Pesquisa combinada
perguntasRoute.get(
  '/search',
  controller.searchPerguntasAll.bind(controller)
);

// GET -> Pesquisa por nome aproximado
perguntasRoute.get(
  '/search-name',
  controller.searchPerguntasNome.bind(controller)
);

// GET -> Busca uma pergunta por nome exato
perguntasRoute.get(
  '/one-nome',
  controller.findOnePerguntasNome.bind(controller)
);

// GET -> Busca todas as perguntas por nome exato
perguntasRoute.get(
  '/all-nome',
  controller.findAllPerguntasNome.bind(controller)
);

// POST -> Cria nova pergunta
perguntasRoute.post(
  '/',
  perguntascreateValidation,
  controller.createNewPerguntas.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca pergunta por ID
perguntasRoute.get(
  '/:perguntasId',
  controller.getOnePerguntasId.bind(controller)
);

// PATCH -> Atualiza pergunta por ID
perguntasRoute.patch(
  '/:perguntasId',
  perguntasupdateValidation,
  controller.updateIdPerguntas.bind(controller)
);

// DELETE -> Remove pergunta por ID
perguntasRoute.delete(
  '/:perguntasId',
  controller.removeIdPerguntas.bind(controller)
);

export { perguntasRoute as perguntasRoutes };

