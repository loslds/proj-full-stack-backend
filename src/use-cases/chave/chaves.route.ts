
// C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { ChavesController } from './chaves.controller';
import { ChavesRepository } from './chaves.repository';
import { chavescreateValidation, chavesupdateValidation } from './chaves.validation';

const chavesRepository = new ChavesRepository(AppDataSource);
const controller = new ChavesController(chavesRepository);
const chavesRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================
// GET -> Lista todas as chaves
chavesRoute.get('/', controller.findAllChaves.bind(controller));
// GET -> Pesquisa combinada
chavesRoute.get('/search', controller.searchChavesAll.bind(controller));
// GET -> Pesquisa identificador aproximado
chavesRoute.get('/search-identificador', controller.searchChavesIdentificador.bind(controller));
// GET -> Lista chaves ativas/inativas
chavesRoute.get('/search-actived', controller.findAllChavesActived.bind(controller));
// GET -> Busca todas as chaves por user
chavesRoute.get('/users/:usersId', controller.findAllChavesUsersId.bind(controller));
// GET -> Lista chaves com detalhes
chavesRoute.get('/details', controller.listAllChavesDetails.bind(controller));
// POST -> Cria nova chave
chavesRoute.post('/', chavescreateValidation, controller.createNewChaves.bind(controller));
// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================
// GET -> Busca chave por ID
chavesRoute.get('/:chavesId', controller.getOneChavesId.bind(controller));
// PATCH -> Atualiza chave por ID
chavesRoute.patch('/:chavesId', chavesupdateValidation, controller.updateIdChaves.bind(controller));
// DELETE -> Desativa chave por ID
chavesRoute.delete('/:chavesId', controller.removeIdChaves.bind(controller));

export { chavesRoute as chavesRoutes };