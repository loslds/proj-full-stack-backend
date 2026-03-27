// C:\repository\proj-full-stack-backend\src\use-cases\user\users.route.ts

import { Router, Request, Response, NextFunction } from 'express';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { AppDataSource } from '../../config/db';
import { createValidation, updateValidation } from './users.validation';

const usersRepository = new UsersRepository(AppDataSource);
const controller = new UsersController(usersRepository);
const usersRoute = Router();

// ==========================================================
// LIST ALL
// GET /users
// ==========================================================
usersRoute.get(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    controller.findAll(req, res, next)
);
// ==========================================================
// LIST BY is_actived
// GET /users/actived
// GET /users/actived?is_actived=true
// GET /users/actived?is_actived=false
// ==========================================================
usersRoute.get(
  '/actived',
  (
    req: Request<{}, {}, {}, { is_actived?: string }>,
    res: Response,
    next: NextFunction
  ) => controller.findAllActived(req, res, next)
);
// ==========================================================
// CREATE
// POST /users
// ==========================================================
usersRoute.post(
  '/',
  createValidation,
  (req: Request, res: Response, next: NextFunction) =>
    controller.create(req, res, next)
);
// ==========================================================
// GET BY ID
// GET /users/:id
// ==========================================================
usersRoute.get(
  '/:id',
  (req: Request<{ id: string }>, res: Response, next: NextFunction) =>
    controller.findById(req, res, next)
);
// ==========================================================
// UPDATE BY ID
// PATCH /users/:id
// ==========================================================
usersRoute.patch(
  '/:id',
  updateValidation,
  (req: Request<{ id: string }>, res: Response, next: NextFunction) =>
    controller.updateById(req, res, next)
);
// ==========================================================
// DELETE BY ID
// DELETE /users/:id
// ==========================================================
usersRoute.delete(
  '/:id',
  (req: Request<{ id: string }>, res: Response, next: NextFunction) =>
    controller.deleteById(req, res, next)
);

export { usersRoute, usersRepository };

