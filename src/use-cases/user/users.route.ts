// C:\repository\proj-full-stack-backend\src\use-cases\user\users.route.ts

import { Router } from 'express';

import { AppDataSource } from '../../config/db';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { userscreateValidation, usersupdateValidation } from './users.validation';

const usersRepository = new UsersRepository(AppDataSource);

const controller = new UsersController(usersRepository);

const usersRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas dinâmicas
// ==========================================================

// GET -> Lista todos os users
usersRoute.get(
  '/',
  controller.findAllUsers.bind(controller)
);

// GET -> Pesquisa combinada
usersRoute.get(
  '/search',
  controller.searchUsersAll.bind(controller)
);

// GET -> Lista users ativos/inativos
usersRoute.get(
  '/search-actived',
  controller.findAllUsersActived.bind(controller)
);

// GET -> Busca todos os users por cadastro
usersRoute.get(
  '/cadastros/:cadastrosId',
  controller.findAllUsersCadastrosId.bind(controller)
);

// GET -> Lista users com detalhes
usersRoute.get(
  '/details',
  controller.listAllUsersDetails.bind(controller)
);

// POST -> Cria novo user
usersRoute.post(
  '/',
  userscreateValidation,
  controller.createNewUsers.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca user por ID
usersRoute.get(
  '/:usersId',
  controller.getOneUsersId.bind(controller)
);

// PATCH -> Atualiza user por ID
usersRoute.patch(
  '/:usersId',
  usersupdateValidation,
  controller.updateIdUsers.bind(controller)
);

// DELETE -> Desativa user por ID
usersRoute.delete(
  '/:usersId',
  controller.removeIdUsers.bind(controller)
);

export { usersRoute as usersRoutes };