

// C:\repository\proj-full-stack-backend\src\use-cases\user\users.controller.ts

import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from './users.repository';

export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  // ==========================================================
  // CREATE
  // ==========================================================
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await this.usersRepository.createUsers(req.body);

      return res.status(201).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // UPDATE BY ID
  // ==========================================================
  async updateById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.id);

      if (Number.isNaN(usersId)) {
        return res.status(400).send({
          success: false,
          message: 'Invalid user id'
        });
      }

      const users = await this.usersRepository.updateUsersId(usersId, req.body);

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // DELETE BY ID
  // ==========================================================
  async deleteById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.id);

      if (Number.isNaN(usersId)) {
        return res.status(400).send({
          success: false,
          message: 'Invalid user id'
        });
      }

      await this.usersRepository.deleteUsersId(usersId);

      return res.status(200).send({
        success: true,
        message: `User ID ${usersId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // GET BY ID
  // ==========================================================
  async findById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.id);

      if (Number.isNaN(usersId)) {
        return res.status(400).send({
          success: false,
          message: 'Invalid user id'
        });
      }

      const users = await this.usersRepository.findOneUsersById(usersId);

      if (!users) {
        return res.status(404).send({
          success: false,
          message: `User ID ${usersId} não encontrado.`
        });
      }

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // LIST ALL
  // ==========================================================
  async findAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await this.usersRepository.findUsersAll();

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // LIST BY is_actived
  // GET /users/actived?is_actived=true
  // GET /users/actived?is_actived=false
  // GET /users/actived
  // ==========================================================
  async findAllActived(
    req: Request<{}, {}, {}, { is_actived?: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { is_actived } = req.query;

      let activedFilter: boolean | undefined = undefined;

      if (is_actived !== undefined) {
        if (is_actived === 'true') {
          activedFilter = true;
        } else if (is_actived === 'false') {
          activedFilter = false;
        } else {
          return res.status(400).send({
            success: false,
            message: 'is_actived must be true or false'
          });
        }
      }

      const users = await this.usersRepository.findUsersAllActived(activedFilter);

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }
}
