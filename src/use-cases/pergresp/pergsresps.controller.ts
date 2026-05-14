
// C:\repository\proj-full-stack-backend\src\use-cases\pergresp\pergsresps.controller.ts

import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../../exceptions/HttpException';
import { PergsrespsRepository } from './pergsresps.repository';
import { PergsrespsCreate, PergsrespsUpdate } from './pergsresps.dto';

export class PergsrespsController {
  constructor(private readonly pergsrespsRepository: PergsrespsRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar perguntas e respostas */
  async createNewPergsresps(
    req: Request<{}, {}, PergsrespsCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const duplicated =
        await this.pergsrespsRepository.hasDuplicatedPergsresps(
          req.body.id_chaves ?? 0
        );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe perguntas e respostas para a chave informada.'
        );
      }

      const pergsresps =
        await this.pergsrespsRepository.createPergsresps(req.body);

      return res.status(201).send({
        success: true,
        pergsresps
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar perguntas e respostas */
  async updateIdPergsresps(
    req: Request<{ pergsrespsId: string }, {}, PergsrespsUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pergsrespsId = Number(req.params.pergsrespsId);

      if (Number.isNaN(pergsrespsId) || pergsrespsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const current =
        await this.pergsrespsRepository.findOnePergsrespsById(pergsrespsId);

      if (!current) {
        throw new HttpException(
          404,
          `Perguntas e respostas ID ${pergsrespsId} não encontradas.`
        );
      }

      const duplicated =
        await this.pergsrespsRepository.hasDuplicatedPergsresps(
          req.body.id_chaves ?? current.id_chaves,
          [pergsrespsId]
        );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe perguntas e respostas para a chave informada.'
        );
      }

      const pergsresps =
        await this.pergsrespsRepository.updatePergsrespsId(
          pergsrespsId,
          req.body
        );

      return res.status(200).send({
        success: true,
        pergsresps
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remove perguntas e respostas */
  async removeIdPergsresps(
    req: Request<{ pergsrespsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pergsrespsId = Number(req.params.pergsrespsId);

      if (Number.isNaN(pergsrespsId) || pergsrespsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.pergsrespsRepository.deletePergsrespsId(pergsrespsId);

      return res.status(200).send({
        success: true,
        message: `Perguntas e respostas ID ${pergsrespsId} removidas com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca perguntas e respostas por ID */
  async getOnePergsrespsId(
    req: Request<{ pergsrespsId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pergsrespsId = Number(req.params.pergsrespsId);

      if (Number.isNaN(pergsrespsId) || pergsrespsId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const pergsresps =
        await this.pergsrespsRepository.findOnePergsrespsById(pergsrespsId);

      if (!pergsresps) {
        throw new HttpException(
          404,
          `Perguntas e respostas ID ${pergsrespsId} não encontradas.`
        );
      }

      return res.status(200).send({
        success: true,
        pergsresps
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todas perguntas e respostas */
  async findAllPergsresps(req: Request, res: Response, next: NextFunction) {
    try {
      const pergsresps =
        await this.pergsrespsRepository.findPergsrespsAll(
          undefined,
          { id: 'ASC' }
        );

      return res.status(200).send({
        success: true,
        pergsresps
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchPergsrespsAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        id,
        id_chaves,
        pergunta1,
        resposta1,
        pergunta2,
        resposta2,
        pergunta3,
        resposta3,
        createdBy,
        updatedBy
      } = req.query;

      const pergsresps =
        await this.pergsrespsRepository.searchPergsresps({
          id: id !== undefined ? Number(id) : undefined,
          id_chaves: id_chaves !== undefined ? Number(id_chaves) : undefined,
          pergunta1: pergunta1 !== undefined ? String(pergunta1) : undefined,
          resposta1: resposta1 !== undefined ? String(resposta1) : undefined,
          pergunta2: pergunta2 !== undefined ? String(pergunta2) : undefined,
          resposta2: resposta2 !== undefined ? String(resposta2) : undefined,
          pergunta3: pergunta3 !== undefined ? String(pergunta3) : undefined,
          resposta3: resposta3 !== undefined ? String(resposta3) : undefined,
          createdBy: createdBy !== undefined ? Number(createdBy) : undefined,
          updatedBy: updatedBy !== undefined ? Number(updatedBy) : undefined
        });

      return res.status(200).send({
        success: true,
        pergsresps
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca perguntas e respostas por chave */
  async findAllPergsrespsChavesId(
    req: Request<{ chavesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const chavesId = Number(req.params.chavesId);

      if (Number.isNaN(chavesId) || chavesId <= 0) {
        throw new HttpException(400, 'ID da chave inválido');
      }

      const pergsresps =
        await this.pergsrespsRepository.findAllPergsrespsByChavesId(chavesId);

      return res.status(200).send({
        success: true,
        total: pergsresps.length,
        pergsresps
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista detalhes */
  async listAllPergsrespsDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pergsresps =
        await this.pergsrespsRepository.listAllPergsrespsDetails();

      return res.status(200).send({
        success: true,
        pergsresps
      });
    } catch (error) {
      next(error);
    }
  }
}

