
// C:\repository\proj-full-stack-backend\src\use-cases\user\users.controller.ts

import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from './users.repository';
import { UsersCreate, UsersUpdate } from './users.dto';
import { HttpException } from '../../exceptions/HttpException';

export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo user */
  async createNewUsers(
    req: Request<{}, {}, UsersCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const duplicated = await this.usersRepository.hasDuplicatedUsers(
        req.body.id_cadastros ?? 0
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe user vinculado ao cadastro informado.'
        );
      }

      const users = await this.usersRepository.createUsers(req.body);

      return res.status(201).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar user pelo ID */
  async updateIdUsers(
    req: Request<{ usersId: string }, {}, UsersUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);

      if (Number.isNaN(usersId) || usersId <= 0) {
        throw new HttpException(400, 'ID do user inválido');
      }

      const duplicated = await this.usersRepository.hasDuplicatedUsers(
        req.body.id_cadastros,
        [usersId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe user vinculado ao cadastro informado.'
        );
      }

      const users = await this.usersRepository.updateUsersId(
        usersId,
        req.body
      );

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Desativar user */
  async removeIdUsers(
    req: Request<{ usersId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);

      if (Number.isNaN(usersId) || usersId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.usersRepository.deleteUsersId(usersId);

      return res.status(200).send({
        success: true,
        message: `User ID ${usersId} desativado com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar user pelo ID */
  async getOneUsersId(
    req: Request<{ usersId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);

      if (Number.isNaN(usersId) || usersId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const users = await this.usersRepository.findOneUsersById(usersId);

      if (!users) {
        throw new HttpException(
          404,
          `User ID ${usersId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os users */
  async findAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.usersRepository.findUsersAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchUsersAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        id,
        id_cadastros,
        is_actived,
        createdBy,
        updatedBy
      } = req.query;

      const users = await this.usersRepository.searchUsers({
        id: id !== undefined ? Number(id) : undefined,
        id_cadastros:
          id_cadastros !== undefined ? Number(id_cadastros) : undefined,
        is_actived:
          is_actived !== undefined ? Number(is_actived) : undefined,
        createdBy: createdBy !== undefined ? Number(createdBy) : undefined,
        updatedBy: updatedBy !== undefined ? Number(updatedBy) : undefined
      });

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista users ativos/inativos */
  async findAllUsersActived(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const is_actived =
        req.query.is_actived !== undefined
          ? Number(req.query.is_actived)
          : undefined;

      const users = await this.usersRepository.findUsersAllActived(
        is_actived
      );

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar users por cadastro */
  async findAllUsersCadastrosId(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);

      if (Number.isNaN(cadastrosId) || cadastrosId <= 0) {
        throw new HttpException(400, 'ID do cadastro inválido');
      }

      const users = await this.usersRepository.findAllUsersByCadastrosId(
        cadastrosId
      );

      return res.status(200).send({
        success: true,
        total: users.length,
        users
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista users com detalhes */
  async listAllUsersDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await this.usersRepository.listAllUsersDetails();

      return res.status(200).send({
        success: true,
        users
      });
    } catch (error) {
      next(error);
    }
  }
}