
// C:\repository\proj-full-stack-backend\src\use-cases\acesso\acessos.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { AcessosController } from './acessos.controller';
import { AcessosRepository } from './acessos.repository';
import {
  acessoscreateValidation,
  acessosupdateValidation
} from './acessos.validation';

const acessosRepository = new AcessosRepository(AppDataSource);
const controller = new AcessosController(acessosRepository);
const acessosRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os acessos
acessosRoute.get('/', controller.findAllAcessos.bind(controller));

// GET -> Pesquisa combinada
acessosRoute.get('/search', controller.searchAcessosAll.bind(controller));

// GET -> Busca todos os acessos por user
acessosRoute.get('/users/:usersId', controller.findAllAcessosUsersId.bind(controller));

// GET -> Lista acessos com detalhes
acessosRoute.get('/details', controller.listAllAcessosDetails.bind(controller));

// POST -> Cria novo acesso
acessosRoute.post(
  '/',
  acessoscreateValidation,
  controller.createNewAcessos.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca acesso por ID
acessosRoute.get('/:acessosId', controller.getOneAcessosId.bind(controller));

// PATCH -> Atualiza acesso por ID
acessosRoute.patch(
  '/:acessosId',
  acessosupdateValidation,
  controller.updateIdAcessos.bind(controller)
);

// DELETE -> Remove acesso por ID
acessosRoute.delete('/:acessosId', controller.removeIdAcessos.bind(controller));

export { acessosRoute as acessosRoutes };


