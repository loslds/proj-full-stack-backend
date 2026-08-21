
// C:\repository\proj-full-stack-backend\src\use-cases\grpservico\grpservicos.controller.ts

import { NextFunction, Request, Response } from 'express';
import { GrpServicosRepository } from './grpservicos.repository';
import { GrpServicosCreate, GrpServicosUpdate } from './grpservicos.dto';
import { HttpException } from '../../exceptions/HttpException';

export class GrpServicosController {
  constructor(
    private readonly grpservicosRepository: GrpServicosRepository
  ) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo grupo de serviço */
  async createNewGrpServicos(
    req: Request<{}, {}, GrpServicosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome } = req.body;

      if (!nome) {
        throw new HttpException(
          400,
          'Nome do grupo de serviço é obrigatório'
        );
      }

      const grpservicos =
        await this.grpservicosRepository.createGrpServicos(req.body);

      return res.status(201).send({
        success: true,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar grupo de serviço pelo ID */
  async updateIdGrpServicos(
    req: Request<{ grpservicosId: string }, {}, GrpServicosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const grpservicosId = Number(req.params.grpservicosId);

      if (Number.isNaN(grpservicosId) || grpservicosId <= 0) {
        throw new HttpException(
          400,
          'ID do grupo de serviço inválido'
        );
      }

      const grpservicos =
        await this.grpservicosRepository.updateGrpServicosId(
          grpservicosId,
          req.body
        );

      return res.status(200).send({
        success: true,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover grupo de serviço */
  async removeIdGrpServicos(
    req: Request<{ grpservicosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const grpservicosId = Number(req.params.grpservicosId);

      if (Number.isNaN(grpservicosId) || grpservicosId <= 0) {
        throw new HttpException(
          400,
          'ID inválido'
        );
      }

      await this.grpservicosRepository.deleteGrpServicosId(
        grpservicosId
      );

      return res.status(200).send({
        success: true
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar grupo de serviço pelo ID */
  async getOneGrpServicosId(
    req: Request<{ grpservicosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const grpservicosId = Number(req.params.grpservicosId);

      if (Number.isNaN(grpservicosId) || grpservicosId <= 0) {
        throw new HttpException(
          400,
          'ID inválido'
        );
      }

      const grpservicos =
        await this.grpservicosRepository.findOneGrpServicosById(
          grpservicosId
        );

      return res.status(200).send({
        success: true,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os grupos de serviços */
  async findAllGrpServicos(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const grpservicos =
        await this.grpservicosRepository.findGrpServicosAll(
          undefined,
          { nome: 'ASC' }
        );

      return res.status(200).send({
        success: true,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id e nome */
  async searchGrpServicosAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, nome } = req.query;

      const grpservicos =
        await this.grpservicosRepository.searchGrpServicos({
          id: id !== undefined
            ? Number(id)
            : undefined,

          nome: nome !== undefined
            ? String(nome)
            : undefined
        });

      return res.status(200).send({
        success: true,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchGrpServicosNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined
          ? String(req.query.text)
          : undefined;

      const grpservicos =
        await this.grpservicosRepository.searchNameParcialGrpServicos(
          text
        );

      return res.status(200).send({
        success: true,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um grupo de serviço pelo nome exato */
  async findOneGrpServicosNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome =
        req.query.nome !== undefined
          ? String(req.query.nome)
          : undefined;

      if (!nome) {
        throw new HttpException(
          400,
          "Parâmetro 'nome' é obrigatório"
        );
      }

      const grpservicos =
        await this.grpservicosRepository.findOneGrpServicosByNome(
          nome
        );

      return res.status(200).send({
        success: true,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os grupos de serviço com nome exato */
  async findAllGrpServicosNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome =
        req.query.nome !== undefined
          ? String(req.query.nome)
          : undefined;

      if (!nome) {
        throw new HttpException(
          400,
          "Parâmetro 'nome' é obrigatório"
        );
      }

      const grpservicos =
        await this.grpservicosRepository.findAllGrpServicosByNome(
          nome
        );

      return res.status(200).send({
        success: true,
        total: grpservicos.length,
        grpservicos
      });
    } catch (error) {
      next(error);
    }
  }
}