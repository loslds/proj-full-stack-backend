
// C:\repository\proj-full-stack-backend\src\use-cases\modulo\modulos.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { ModulosController } from './modulos.controller';
import { ModulosRepository } from './modulos.repository';
import {
  modulosCreateValidation,
  modulosUpdateValidation
} from './modulos.validation';

const modulosRepository = new ModulosRepository(AppDataSource);
const controller = new ModulosController(modulosRepository);
const modulosRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os módulos
modulosRoute.get(
  '/',
  controller.findAllModulos.bind(controller)
);

// GET -> Pesquisa combinada
modulosRoute.get(
  '/search',
  controller.searchModulosAll.bind(controller)
);

// GET -> Pesquisa por name aproximado
modulosRoute.get(
  '/search-name',
  controller.searchModulosName.bind(controller)
);

// GET -> Busca um módulo por name exato
modulosRoute.get(
  '/one-name',
  controller.findOneModulosName.bind(controller)
);

// GET -> Busca todos os módulos por name exato
modulosRoute.get(
  '/all-name',
  controller.findAllModulosName.bind(controller)
);

// POST -> Cria novo módulo
modulosRoute.post(
  '/',
  modulosCreateValidation,
  controller.createNewModulos.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca módulo por ID
modulosRoute.get(
  '/:modulosId',
  controller.getOneModulosId.bind(controller)
);

// PATCH -> Atualiza módulo por ID
modulosRoute.patch(
  '/:modulosId',
  modulosUpdateValidation,
  controller.updateIdModulos.bind(controller)
);

// DELETE -> Remove módulo por ID
modulosRoute.delete(
  '/:modulosId',
  controller.removeIdModulos.bind(controller)
);

export { modulosRoute as modulosRoutes };

