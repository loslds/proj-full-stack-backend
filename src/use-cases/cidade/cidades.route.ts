// src/use-cases/cidade/cidades.route.ts
import { AppDataSource } from '../../config/db';
import { Router } from 'express';
import { CidadesController } from './cidades.controller';
import { CidadesRepository } from './cidades.repository';
import {
  cidadesCreateValidation,
  cidadesUpdateValidation
} from './cidades.validation';

const cidadesRepository = new CidadesRepository(AppDataSource);
const controller = new CidadesController(cidadesRepository);

const cidadesRoute = Router();

/** ROTAS CIDADES */

// 1 - POST -> Cria nova cidade
cidadesRoute.post(
  '/',
  cidadesCreateValidation,
  controller.createNewCidades.bind(controller)
);

// 2 - PATCH -> Atualiza cidade por ID
cidadesRoute.patch(
  '/:cidadesId',
  cidadesUpdateValidation,
  controller.updateIdCidades.bind(controller)
);

// 3 - DELETE -> Remove cidade por ID
cidadesRoute.delete(
  '/:cidadesId',
  controller.removeCidadesId.bind(controller)
);

// 4 - GET -> Lista todas as cidades
cidadesRoute.get(
  '/',
  controller.findAllCidades.bind(controller)
);

// 5 - GET -> Busca cidade por ID
cidadesRoute.get(
  '/id/:cidadesId',
  controller.getOneIdCidades.bind(controller)
);

// 6 - GET -> Busca cidade por nome exato
cidadesRoute.get(
  '/nome',
  controller.findOneNomeCidades.bind(controller)
);

// 7 - GET -> Busca por nome ou estado com paginação
cidadesRoute.get(
  '/search',
  controller.searchByNomeOuEstadoPaginado.bind(controller)
);

// 8 - GET -> Lista cidades por estado
cidadesRoute.get(
  '/estado/:id_estados',
  controller.listAllCidadesByIdEstado.bind(controller)
);

// 9 - GET -> Lista todas cidades + estado (detalhes)
cidadesRoute.get(
  '/details',
  controller.listAllCidadesDetails.bind(controller)
);

export { cidadesRoute as cidadesRoutes };