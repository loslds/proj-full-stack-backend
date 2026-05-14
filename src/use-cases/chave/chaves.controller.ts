
// C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.controller.ts

import { NextFunction, Request, Response } from 'express';
import { ChavesRepository } from './chaves.repository';
import { ChavesCreate, ChavesUpdate } from './chaves.dto';
import { HttpException } from '../../exceptions/HttpException';

export class ChavesController {
  constructor(private readonly chavesRepository: ChavesRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar nova chave */
  async createNewChaves(
    req: Request<{}, {}, ChavesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const duplicated = await this.chavesRepository.hasDuplicatedChaves(
        req.body.identificador,
        req.body.id_users ?? 0
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe chave com identificador e usuário informados.'
        );
      }

      const chaves = await this.chavesRepository.createChaves(req.body);

      return res.status(201).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar chave pelo ID */
  async updateIdChaves(
    req: Request<{ chavesId: string }, {}, ChavesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const chavesId = Number(req.params.chavesId);

      if (Number.isNaN(chavesId) || chavesId <= 0) {
        throw new HttpException(400, 'ID da chave inválido');
      }

      const current = await this.chavesRepository.findOneChavesById(chavesId);

      if (!current) {
        throw new HttpException(
          404,
          `Chave ID ${chavesId} não encontrada.`
        );
      }

      const duplicated = await this.chavesRepository.hasDuplicatedChaves(
        req.body.identificador ?? current.identificador,
        req.body.id_users ?? current.id_users,
        [chavesId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe chave com identificador e usuário informados.'
        );
      }

      const chaves = await this.chavesRepository.updateChavesId(
        chavesId,
        req.body
      );

      return res.status(200).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Desativar chave */
  async removeIdChaves(
    req: Request<{ chavesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const chavesId = Number(req.params.chavesId);

      if (Number.isNaN(chavesId) || chavesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.chavesRepository.deleteChavesId(chavesId);

      return res.status(200).send({
        success: true,
        message: `Chave ID ${chavesId} desativada com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar chave pelo ID */
  async getOneChavesId(
    req: Request<{ chavesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const chavesId = Number(req.params.chavesId);

      if (Number.isNaN(chavesId) || chavesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const chaves = await this.chavesRepository.findOneChavesById(chavesId);

      if (!chaves) {
        throw new HttpException(
          404,
          `Chave ID ${chavesId} não encontrada.`
        );
      }

      return res.status(200).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todas as chaves */
  async findAllChaves(req: Request, res: Response, next: NextFunction) {
    try {
      const chaves = await this.chavesRepository.findChavesAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchChavesAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, id_users, identificador, ativo, createdBy, updatedBy } =
        req.query;

      const chaves = await this.chavesRepository.searchChaves({
        id: id !== undefined ? Number(id) : undefined,
        id_users: id_users !== undefined ? Number(id_users) : undefined,
        identificador:
          identificador !== undefined ? String(identificador) : undefined,
        ativo: ativo !== undefined ? Number(ativo) : undefined,
        createdBy: createdBy !== undefined ? Number(createdBy) : undefined,
        updatedBy: updatedBy !== undefined ? Number(updatedBy) : undefined
      });

      return res.status(200).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por identificador aproximado */
  async searchChavesIdentificador(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const chaves =
        await this.chavesRepository.searchIdentificadorParcialChaves(text);

      return res.status(200).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista chaves ativas/inativas */
  async findAllChavesActived(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ativo =
        req.query.ativo !== undefined ? Number(req.query.ativo) : undefined;

      const chaves = await this.chavesRepository.findChavesAllActived(ativo);

      return res.status(200).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar chaves por user */
  async findAllChavesUsersId(
    req: Request<{ usersId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);

      if (Number.isNaN(usersId) || usersId <= 0) {
        throw new HttpException(400, 'ID do user inválido');
      }

      const chaves = await this.chavesRepository.findAllChavesByUsersId(
        usersId
      );

      return res.status(200).send({
        success: true,
        total: chaves.length,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista chaves com detalhes */
  async listAllChavesDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const chaves = await this.chavesRepository.listAllChavesDetails();

      return res.status(200).send({
        success: true,
        chaves
      });
    } catch (error) {
      next(error);
    }
  }
}



