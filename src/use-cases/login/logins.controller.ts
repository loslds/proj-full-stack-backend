
// C:\repository\proj-full-stack-backend\src\use-cases\login\logins.controller.ts

import { NextFunction, Request, Response } from 'express';
import { LoginsRepository } from './logins.repository';
import { LoginsCreate, LoginsUpdate } from './logins.dto';
import { HttpException } from '../../exceptions/HttpException';

export class LoginsController {
  constructor(private readonly loginsRepository: LoginsRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo login */
  async createNewLogins(
    req: Request<{}, {}, LoginsCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const duplicated = await this.loginsRepository.hasDuplicatedLogins(
        req.body.id_users ?? 0
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe login aberto para o usuário informado.'
        );
      }

      const logins = await this.loginsRepository.createLogins(req.body);

      return res.status(201).send({
        success: true,
        logins
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar login pelo ID */
  async updateIdLogins(
    req: Request<{ loginsId: string }, {}, LoginsUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const loginsId = Number(req.params.loginsId);

      if (Number.isNaN(loginsId) || loginsId <= 0) {
        throw new HttpException(400, 'ID do login inválido');
      }

      const duplicated = await this.loginsRepository.hasDuplicatedLogins(
        req.body.id_users,
        [loginsId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe login aberto para o usuário informado.'
        );
      }

      const logins = await this.loginsRepository.updateLoginsId(
        loginsId,
        req.body
      );

      return res.status(200).send({
        success: true,
        logins
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Finalizar login */
  async removeIdLogins(
    req: Request<{ loginsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const loginsId = Number(req.params.loginsId);

      if (Number.isNaN(loginsId) || loginsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.loginsRepository.deleteLoginsId(loginsId);

      return res.status(200).send({
        success: true,
        message: `Login ID ${loginsId} finalizado com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar login pelo ID */
  async getOneLoginsId(
    req: Request<{ loginsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const loginsId = Number(req.params.loginsId);

      if (Number.isNaN(loginsId) || loginsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const logins = await this.loginsRepository.findOneLoginsById(loginsId);

      if (!logins) {
        throw new HttpException(
          404,
          `Login ID ${loginsId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        logins
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os logins */
  async findAllLogins(req: Request, res: Response, next: NextFunction) {
    try {
      const logins = await this.loginsRepository.findLoginsAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        logins
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchLoginsAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, id_users, tt_minutos, createdBy, updatedBy } = req.query;

      const logins = await this.loginsRepository.searchLogins({
        id: id !== undefined ? Number(id) : undefined,
        id_users: id_users !== undefined ? Number(id_users) : undefined,
        tt_minutos:
          tt_minutos !== undefined ? Number(tt_minutos) : undefined,
        createdBy: createdBy !== undefined ? Number(createdBy) : undefined,
        updatedBy: updatedBy !== undefined ? Number(updatedBy) : undefined
      });

      return res.status(200).send({
        success: true,
        logins
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar logins por user */
  async findAllLoginsUsersId(
    req: Request<{ usersId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);

      if (Number.isNaN(usersId) || usersId <= 0) {
        throw new HttpException(400, 'ID do user inválido');
      }

      const logins = await this.loginsRepository.findAllLoginsByUsersId(
        usersId
      );

      return res.status(200).send({
        success: true,
        total: logins.length,
        logins
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista logins com detalhes */
  async listAllLoginsDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const logins = await this.loginsRepository.listAllLoginsDetails();

      return res.status(200).send({
        success: true,
        logins
      });
    } catch (error) {
      next(error);
    }
  }
}


