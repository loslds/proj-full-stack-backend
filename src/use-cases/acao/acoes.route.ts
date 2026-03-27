
// C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { AcoesController } from './acoes.controller';
import { AcoesRepository } from './acoes.repository';
import {
  acoescreateValidation,
  acoesupdateValidation
} from './acoes.validation';

const acoesRepository = new AcoesRepository(AppDataSource);
const controller = new AcoesController(acoesRepository);
const acoesRoute = Router();

// ============================================================
// * CONSULTAS PERSONALIZADAS *
// ============================================================

// GET -> Pesquisa combinada
acoesRoute.get(
  '/search',
  controller.searchAcoesAll.bind(controller)
);

// GET -> Pesquisa por nome aproximado
acoesRoute.get(
  '/search-nome',
  controller.searchAcoesNome.bind(controller)
);

// GET -> Pesquisa por abreviação aproximada
acoesRoute.get(
  '/search-abrev',
  controller.searchAcoesAbrev.bind(controller)
);

// GET -> Pesquisa por cor aproximada
acoesRoute.get(
  '/search-cor',
  controller.searchAcoesCor.bind(controller)
);

// GET -> Busca uma ação por nome exato
acoesRoute.get(
  '/one-nome',
  controller.findOneAcoesNome.bind(controller)
);

// GET -> Busca todas as ações por nome exato
acoesRoute.get(
  '/all-nome',
  controller.findAllAcoesNome.bind(controller)
);

// GET -> Busca uma ação por abreviação exata
acoesRoute.get(
  '/one-abrev',
  controller.findOneAcoesAbrev.bind(controller)
);

// GET -> Busca todas as ações por abreviação exata
acoesRoute.get(
  '/all-abrev',
  controller.findAllAcoesAbrev.bind(controller)
);

// GET -> Busca uma ação por nível exato
acoesRoute.get(
  '/one-nivel',
  controller.findOneAcoesNivel.bind(controller)
);

// GET -> Busca todas as ações por nível exato
acoesRoute.get(
  '/all-nivel',
  controller.findAllAcoesNivel.bind(controller)
);

// ============================================================
// * CRUD *
// ============================================================

// GET -> Lista todas as ações
acoesRoute.get(
  '/',
  controller.findAllAcoes.bind(controller)
);

// POST -> Cria nova ação
acoesRoute.post(
  '/',
  acoescreateValidation,
  controller.createNewAcoes.bind(controller)
);

// GET -> Busca ação por ID
acoesRoute.get(
  '/:acoesId',
  controller.getOneAcoesId.bind(controller)
);

// PATCH -> Atualiza ação por ID
acoesRoute.patch(
  '/:acoesId',
  acoesupdateValidation,
  controller.updateIdAcoes.bind(controller)
);

// DELETE -> Remove ação por ID
acoesRoute.delete(
  '/:acoesId',
  controller.removeIdAcoes.bind(controller)
);

export { acoesRoute as acoesRoutes };