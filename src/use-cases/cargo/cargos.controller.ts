
//C:\repository\proj-full-stack-backend\src\use-cases\cargo\cargos.controller.ts
import { NextFunction, Request, Response } from 'express';
import { CargosRepository } from './cargos.repository';
import { CargosCreate, CargosUpdate } from './cargos.dto';
import { HttpException } from '../../exceptions/HttpException';

export class CargosController {
  constructor(private readonly cargosRepository: CargosRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todos os cargos */
  async findAllCargos(req: Request, res: Response, next: NextFunction) {
    try {
      const cargos = await this.cargosRepository.findCargosAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({ success: true, cargos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada */
  async searchCargosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome } = req.query;

      const cargos = await this.cargosRepository.searchCargos({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined
      });

      return res.status(200).send({ success: true, cargos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchCargosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const cargos = await this.cargosRepository.searchNomeCargos(text);

      return res.status(200).send({ success: true, cargos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um cargo pelo nome exato */
  async findOneCargosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const cargos = await this.cargosRepository.findOneNomeCargos(nome);

      return res.status(200).send({ success: true, cargos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os cargos com nome exato */
  async findAllCargosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const cargos = await this.cargosRepository.findAllNomeCargos(nome);

      return res.status(200).send({
        success: true,
        total: cargos.length,
        cargos
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar novo cargo */
  async createNewCargos(
    req: Request<{}, {}, CargosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome } = req.body;

      if (!nome) {
        throw new HttpException(400, 'Nome do cargo é obrigatório');
      }

      const cargos = await this.cargosRepository.createCargos(req.body);

      return res.status(201).send({ success: true, cargos });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar cargo pelo ID */
  async updateIdCargos(
    req: Request<{ cargosId: string }, {}, CargosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cargosId = Number(req.params.cargosId);

      if (!cargosId || Number.isNaN(cargosId) || cargosId <= 0) {
        throw new HttpException(400, 'ID do cargo inválido');
      }

      const cargos = await this.cargosRepository.updateCargos(
        cargosId,
        req.body
      );

      return res.status(200).send({ success: true, cargos });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover cargo */
  async removeIdCargos(
    req: Request<{ cargosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cargosId = Number(req.params.cargosId);

      if (Number.isNaN(cargosId) || cargosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.cargosRepository.deleteCargos(cargosId);

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cargo pelo ID */
  async getOneCargosId(
    req: Request<{ cargosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cargosId = Number(req.params.cargosId);

      if (Number.isNaN(cargosId) || cargosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const cargos = await this.cargosRepository.findCargosById(cargosId);

      return res.status(200).send({ success: true, cargos });
    } catch (error) {
      next(error);
    }
  }
}