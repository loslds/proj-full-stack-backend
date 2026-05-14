
// C:\repository\proj-full-stack-backend\src\use-cases\pergresp\pergsresps.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { PergsrespsController } from './pergsresps.controller';
import { PergsrespsRepository } from './pergsresps.repository';
import { pergsrespscreateValidation, pergsrespsupdateValidation } from './pergsresps.validation';

const pergsrespsRepository = new PergsrespsRepository(AppDataSource);
const controller = new PergsrespsController(pergsrespsRepository);
const pergsrespsRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================
// GET -> Lista todas perguntas e respostas
pergsrespsRoute.get('/', controller.findAllPergsresps.bind(controller));
// GET -> Pesquisa combinada
pergsrespsRoute.get('/search', controller.searchPergsrespsAll.bind(controller));
// GET -> Busca perguntas e respostas por chave
pergsrespsRoute.get('/chaves/:chavesId', controller.findAllPergsrespsChavesId.bind(controller));
// GET -> Lista perguntas e respostas com detalhes
pergsrespsRoute.get('/details', controller.listAllPergsrespsDetails.bind(controller));
// POST -> Cria perguntas e respostas
pergsrespsRoute.post('/', pergsrespscreateValidation, controller.createNewPergsresps.bind(controller));
// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================
// GET -> Busca perguntas e respostas por ID
pergsrespsRoute.get('/:pergsrespsId', controller.getOnePergsrespsId.bind(controller));
// PATCH -> Atualiza perguntas e respostas por ID
pergsrespsRoute.patch('/:pergsrespsId', pergsrespsupdateValidation, controller.updateIdPergsresps.bind(controller));
// DELETE -> Remove perguntas e respostas por ID
pergsrespsRoute.delete('/:pergsrespsId', controller.removeIdPergsresps.bind(controller));

export { pergsrespsRoute as pergsrespsRoutes };