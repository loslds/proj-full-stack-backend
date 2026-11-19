
// C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.controller.ts
// C:\repository\proj-full-stack-backend\src\use-cases\servico\servicos.controller.ts

import { NextFunction, Request, Response } from 'express';
import { ServicosRepository } from './servicos.repository';
import { ServicosCreate, ServicosUpdate } from './servicos.dto';
import { HttpException } from '../../exceptions/HttpException';

export class ServicosController {
  constructor(private readonly servicosRepository: ServicosRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todos os serviços */
  async findAllServicos(req: Request, res: Response, next: NextFunction) {
    try {
      const servicos = await this.servicosRepository.findServicosAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({ success: true, servicos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada por id e nome */
  async searchServicosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome } = req.query;

      const servicos = await this.servicosRepository.searchServicos({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined
      });

      return res.status(200).send({ success: true, servicos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchServicosName(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;

      const servicos =
        await this.servicosRepository.searchNameServicos(text);

      return res.status(200).send({ success: true, servicos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um serviço pelo nome exato */
  async findOneServicosName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const servicos =
        await this.servicosRepository.findOneNameServicos(nome);

      return res.status(200).send({ success: true, servicos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os serviços com nome exato */
  async findAllServicosName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const servicos =
        await this.servicosRepository.findAllNameServicos(nome);

      return res.status(200).send({
        success: true,
        total: servicos.length,
        servicos
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar novo serviço */
  async createNewServicos(
    req: Request<{}, {}, ServicosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome } = req.body;

      if (!nome) {
        throw new HttpException(400, 'Nome do serviço é obrigatório');
      }

      const servicos =
        await this.servicosRepository.createServicos(req.body);

      return res.status(201).send({ success: true, servicos });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar serviço pelo ID */
  async updateIdServicos(
    req: Request<{ servicosId: string }, {}, ServicosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const servicosId = Number(req.params.servicosId);

      if (!servicosId || Number.isNaN(servicosId) || servicosId <= 0) {
        throw new HttpException(400, 'ID do serviço inválido');
      }

      const servicos =
        await this.servicosRepository.updateServicos(
          servicosId,
          req.body
        );

      return res.status(200).send({ success: true, servicos });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover serviço */
  async removeIdServicos(
    req: Request<{ servicosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const servicosId = Number(req.params.servicosId);

      if (Number.isNaN(servicosId) || servicosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.servicosRepository.deleteServicos(servicosId);

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar serviço pelo ID */
  async getOneServicosId(
    req: Request<{ servicosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const servicosId = Number(req.params.servicosId);

      if (Number.isNaN(servicosId) || servicosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const servicos =
        await this.servicosRepository.findServicosById(servicosId);

      return res.status(200).send({ success: true, servicos });
    } catch (error) {
      next(error);
    }
  }
}