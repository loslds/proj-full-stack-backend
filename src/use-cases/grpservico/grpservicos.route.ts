
// C:\repository\proj-full-stack-backend\src\use-cases\grpservico\grpservicos.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';

import { GrpServicosController } from './grpservicos.controller';
import { GrpServicosRepository } from './grpservicos.repository';

import {
  grpservicoscreateValidation,
  grpservicosupdateValidation
} from './grpservicos.validation';


const grpservicosRepository = new GrpServicosRepository(AppDataSource);
const controller = new GrpServicosController(grpservicosRepository);
const grpservicosRoute = Router();


// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================


// GET -> Lista todos os grupos de serviços
grpservicosRoute.get(
  '/',
  controller.findAllGrpServicos.bind(controller)
);


// GET -> Pesquisa combinada por id e nome
grpservicosRoute.get(
  '/search',
  controller.searchGrpServicosAll.bind(controller)
);


// GET -> Pesquisa por nome aproximado
grpservicosRoute.get(
  '/search-nome',
  controller.searchGrpServicosNome.bind(controller)
);


// GET -> Busca um grupo de serviço por nome exato
grpservicosRoute.get(
  '/one-nome',
  controller.findOneGrpServicosNome.bind(controller)
);


// GET -> Busca todos os grupos de serviço por nome exato
grpservicosRoute.get(
  '/all-nome',
  controller.findAllGrpServicosNome.bind(controller)
);


// POST -> Cria novo grupo de serviço
grpservicosRoute.post(
  '/',
  grpservicoscreateValidation,
  controller.createNewGrpServicos.bind(controller)
);


// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================


// GET -> Busca grupo de serviço por ID
grpservicosRoute.get(
  '/:grpservicosId',
  controller.getOneGrpServicosId.bind(controller)
);


// PATCH -> Atualiza grupo de serviço por ID
grpservicosRoute.patch(
  '/:grpservicosId',
  grpservicosupdateValidation,
  controller.updateIdGrpServicos.bind(controller)
);


// DELETE -> Remove grupo de serviço por ID
grpservicosRoute.delete(
  '/:grpservicosId',
  controller.removeIdGrpServicos.bind(controller)
);


export { grpservicosRoute as grpservicosRoutes };