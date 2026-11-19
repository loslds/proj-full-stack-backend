// C:\repository\proj-full-stack-backend\src\use-cases\servico\servicos.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';

import { ServicosController } from './servicos.controller';
import { ServicosRepository } from './servicos.repository';

import {
  servicoscreateValidation,
  servicosupdateValidation
} from './servicos.validation';


const servicosRepository = new ServicosRepository(AppDataSource);

const controller = new ServicosController(servicosRepository);

const servicosRoute = Router();


// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================


// GET -> Lista todos os serviços
servicosRoute.get(
  '/',
  controller.findAllServicos.bind(controller)
);


// GET -> Pesquisa combinada por id e nome
servicosRoute.get(
  '/search',
  controller.searchServicosAll.bind(controller)
);


// GET -> Pesquisa por nome aproximado
servicosRoute.get(
  '/search-nome',
  controller.searchServicosName.bind(controller)
);


// GET -> Busca um serviço por nome exato
servicosRoute.get(
  '/one-nome',
  controller.findOneServicosName.bind(controller)
);


// GET -> Busca todos os serviços por nome exato
servicosRoute.get(
  '/all-nome',
  controller.findAllServicosName.bind(controller)
);


// POST -> Cria novo serviço
servicosRoute.post(
  '/',
  servicoscreateValidation,
  controller.createNewServicos.bind(controller)
);


// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================


// GET -> Busca serviço por ID
servicosRoute.get(
  '/:servicosId',
  controller.getOneServicosId.bind(controller)
);


// PATCH -> Atualiza serviço por ID
servicosRoute.patch(
  '/:servicosId',
  servicosupdateValidation,
  controller.updateIdServicos.bind(controller)
);


// DELETE -> Remove serviço por ID
servicosRoute.delete(
  '/:servicosId',
  controller.removeIdServicos.bind(controller)
);


export { servicosRoute as servicosRoutes };