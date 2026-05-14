
// C:\repository\proj-full-stack-backend\src\use-cases\login\logins.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { LoginsController } from './logins.controller';
import { LoginsRepository } from './logins.repository';
import { loginscreateValidation, loginsupdateValidation } from './logins.validation';

const loginsRepository = new LoginsRepository(AppDataSource);
const controller = new LoginsController(loginsRepository);
const loginsRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================
// GET -> Lista todos os logins
loginsRoute.get('/', controller.findAllLogins.bind(controller));
// GET -> Pesquisa combinada
loginsRoute.get('/search', controller.searchLoginsAll.bind(controller));
// GET -> Busca todos os logins por user
loginsRoute.get('/users/:usersId', controller.findAllLoginsUsersId.bind(controller));
// GET -> Lista logins com detalhes
loginsRoute.get('/details', controller.listAllLoginsDetails.bind(controller));
// POST -> Cria novo login
loginsRoute.post('/', loginscreateValidation, controller.createNewLogins.bind(controller));
// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================
// GET -> Busca login por ID
loginsRoute.get('/:loginsId', controller.getOneLoginsId.bind(controller));
// PATCH -> Atualiza login por ID
loginsRoute.patch('/:loginsId', loginsupdateValidation, controller.updateIdLogins.bind(controller));
// DELETE -> Finaliza login por ID
loginsRoute.delete('/:loginsId', controller.removeIdLogins.bind(controller));

export { loginsRoute as loginsRoutes };

