
  
// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { EstadosController } from './estados.controller';
import { EstadosRepository } from './estados.repository';
import {
  estadoscreateValidation,
  estadosupdateValidation
} from './estados.validation';

const estadosRepository = new EstadosRepository(AppDataSource);
const controller = new EstadosController(estadosRepository);
const estadosRoute = Router();

// ============================================================
// * CONSULTAS PERSONALIZADAS *
// ============================================================

// GET -> Pesquisa combinada
estadosRoute.get(
  '/search',
  controller.searchEstadosAll.bind(controller)
);

// GET -> Pesquisa por nome aproximado
estadosRoute.get(
  '/search-nome',
  controller.searchEstadosNome.bind(controller)
);

// GET -> Pesquisa por prefixo aproximado
estadosRoute.get(
  '/search-prefixo',
  controller.searchEstadosPrefixo.bind(controller)
);

// GET -> Busca um estado por nome exato
estadosRoute.get(
  '/one-nome',
  controller.findOneEstadosNome.bind(controller)
);

// GET -> Busca todos os estados por nome exato
estadosRoute.get(
  '/all-nome',
  controller.findAllEstadosNome.bind(controller)
);

// GET -> Busca um estado por prefixo exato
estadosRoute.get(
  '/one-prefixo',
  controller.findOneEstadosPrefixo.bind(controller)
);

// GET -> Busca todos os estados por prefixo exato
estadosRoute.get(
  '/all-prefixo',
  controller.findAllEstadosPrefixo.bind(controller)
);

// ============================================================
// * CRUD *
// ============================================================

// GET -> Lista todos os estados
estadosRoute.get(
  '/',
  controller.findAllEstados.bind(controller)
);

// POST -> Cria novo estado
estadosRoute.post(
  '/',
  estadoscreateValidation,
  controller.createNewEstados.bind(controller)
);

// GET -> Busca estado por ID
estadosRoute.get(
  '/:estadosId',
  controller.getOneEstadosId.bind(controller)
);

// PATCH -> Atualiza estado por ID
estadosRoute.patch(
  '/:estadosId',
  estadosupdateValidation,
  controller.updateIdEstados.bind(controller)
);

// DELETE -> Remove estado por ID
estadosRoute.delete(
  '/:estadosId',
  controller.removeIdEstados.bind(controller)
);

export { estadosRoute as estadosRoutes };

