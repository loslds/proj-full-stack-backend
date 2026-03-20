
  
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { CidadesController } from './cidades.controller';
import { CidadesRepository } from './cidades.repository';
import {cidadescreateValidation, cidadesupdateValidation } from './cidades.validation';

const cidadesRepository = new CidadesRepository(AppDataSource);
const controller = new CidadesController(cidadesRepository);
const cidadesRoute = Router();

// ==========================================================
// ROTAS CIDADES
// ==========================================================

// POST -> Cria nova cidade
cidadesRoute.post(
  '/',
  cidadescreateValidation,
  controller.createNewCidades.bind(controller)
);

// PATCH -> Atualiza cidade por ID
cidadesRoute.patch(
  '/:cidadesId',
  cidadesupdateValidation,
  controller.updateIdCidades.bind(controller)
);

// DELETE -> Remove cidade por ID
cidadesRoute.delete(
  '/:cidadesId',
  controller.removeCidadesId.bind(controller)
);

// GET -> Lista todas as cidades
cidadesRoute.get(
  '/',
  controller.findAllCidades.bind(controller)
);

// GET -> Busca cidade por ID
cidadesRoute.get(
  '/id/:cidadesId',
  controller.getOneIdCidades.bind(controller)
);

// GET -> Busca cidade por nome exato
cidadesRoute.get(
  '/nome',
  controller.findOneNomeCidades.bind(controller)
);

// GET -> Busca por nome ou estado com paginação
cidadesRoute.get(
  '/search',
  controller.searchByNomeOuEstadoPaginado.bind(controller)
);

// GET -> Lista cidades por estado
cidadesRoute.get(
  '/estado/:id_estados',
  controller.listAllCidadesByIdEstado.bind(controller)
);

// GET -> Lista todas cidades + estado (detalhes)
cidadesRoute.get(
  '/details',
  controller.listAllCidadesDetails.bind(controller)
);

export { cidadesRoute as cidadesRoutes };

