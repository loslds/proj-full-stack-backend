
// C:\repository\proj-full-stack-backend\src\use-cases\acesso\acessos.controller.ts

import { NextFunction, Request, Response } from 'express';
import { AcessosRepository } from './acessos.repository';
import { AcessosCreate, AcessosUpdate } from './acessos.dto';
import { HttpException } from '../../exceptions/HttpException';

export class AcessosController {
  constructor(private readonly acessosRepository: AcessosRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo acesso */
  async createNewAcessos(
    req: Request<{}, {}, AcessosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const duplicated = await this.acessosRepository.hasDuplicatedAcessos(
        req.body.id_users ?? 0
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe acesso vinculado ao usuário informado.'
        );
      }

      const acessos = await this.acessosRepository.createAcessos(req.body);

      return res.status(201).send({
        success: true,
        acessos
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar acesso pelo ID */
  async updateIdAcessos(
    req: Request<{ acessosId: string }, {}, AcessosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const acessosId = Number(req.params.acessosId);

      if (Number.isNaN(acessosId) || acessosId <= 0) {
        throw new HttpException(400, 'ID do acesso inválido');
      }

      const duplicated = await this.acessosRepository.hasDuplicatedAcessos(
        req.body.id_users,
        [acessosId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe acesso vinculado ao usuário informado.'
        );
      }

      const acessos = await this.acessosRepository.updateAcessosId(
        acessosId,
        req.body
      );

      return res.status(200).send({
        success: true,
        acessos
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover acesso */
  async removeIdAcessos(
    req: Request<{ acessosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const acessosId = Number(req.params.acessosId);

      if (Number.isNaN(acessosId) || acessosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.acessosRepository.deleteAcessosId(acessosId);

      return res.status(200).send({
        success: true,
        message: `Acesso ID ${acessosId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar acesso pelo ID */
  async getOneAcessosId(
    req: Request<{ acessosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const acessosId = Number(req.params.acessosId);

      if (Number.isNaN(acessosId) || acessosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const acessos = await this.acessosRepository.findOneAcessosById(
        acessosId
      );

      if (!acessos) {
        throw new HttpException(
          404,
          `Acesso ID ${acessosId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        acessos
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os acessos */
  async findAllAcessos(req: Request, res: Response, next: NextFunction) {
    try {
      const acessos = await this.acessosRepository.findAcessosAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        acessos
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchAcessosAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, id_users, createdBy, updatedBy } = req.query;

      const acessos = await this.acessosRepository.searchAcessos({
        id: id !== undefined ? Number(id) : undefined,
        id_users: id_users !== undefined ? Number(id_users) : undefined,
        createdBy: createdBy !== undefined ? Number(createdBy) : undefined,
        updatedBy: updatedBy !== undefined ? Number(updatedBy) : undefined
      });

      return res.status(200).send({
        success: true,
        acessos
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar acessos por user */
  async findAllAcessosUsersId(
    req: Request<{ usersId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);

      if (Number.isNaN(usersId) || usersId <= 0) {
        throw new HttpException(400, 'ID do user inválido');
      }

      const acessos = await this.acessosRepository.findAllAcessosByUsersId(
        usersId
      );

      return res.status(200).send({
        success: true,
        total: acessos.length,
        acessos
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista acessos com detalhes */
  async listAllAcessosDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const acessos = await this.acessosRepository.listAllAcessosDetails();

      return res.status(200).send({
        success: true,
        acessos
      });
    } catch (error) {
      next(error);
    }
  }
}

