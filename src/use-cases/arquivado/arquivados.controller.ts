// C:\repository\proj-full-stack-backend\src\use-cases\arquivado\arquivados.controller.ts
import { NextFunction, Request, Response } from 'express';
import { ArquivadosRepository } from './arquivados.repository';
import { ArquivadosCreate, ArquivadosUpdate } from './arquivados.dto';
import { HttpException } from '../../exceptions/HttpException';

export class ArquivadosController {
  constructor(private readonly arquivadosRepository: ArquivadosRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo registro de arquivamento */
  async createNewArquivados(
    req: Request<{}, {}, ArquivadosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tab_origem, id_origem } = req.body;

      if (!tab_origem || !id_origem) {
        throw new HttpException(
          400,
          'tab_origem e id_origem são obrigatórios'
        );
      }

      const arquivados = await this.arquivadosRepository.createArquivados(
        req.body
      );

      return res.status(201).send({
        success: true,
        arquivados
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar pelo ID */
  async updateIdArquivados(
    req: Request<{ arquivadosId: string }, {}, ArquivadosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const arquivadosId = Number(req.params.arquivadosId);

      if (Number.isNaN(arquivadosId) || arquivadosId <= 0) {
        throw new HttpException(400, 'ID do arquivado inválido');
      }

      const arquivados = await this.arquivadosRepository.updateArquivadosId(
        arquivadosId,
        req.body
      );

      return res.status(200).send({
        success: true,
        arquivados
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover pelo ID */
  async removeIdArquivados(
    req: Request<{ arquivadosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const arquivadosId = Number(req.params.arquivadosId);

      if (Number.isNaN(arquivadosId) || arquivadosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.arquivadosRepository.deleteArquivadosId(arquivadosId);

      return res.status(200).send({
        success: true
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar pelo ID */
  async getOneArquivadosId(
    req: Request<{ arquivadosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const arquivadosId = Number(req.params.arquivadosId);

      if (Number.isNaN(arquivadosId) || arquivadosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const arquivados = await this.arquivadosRepository.findOneArquivadosById(
        arquivadosId
      );

      return res.status(200).send({
        success: true,
        arquivados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos */
  async findAllArquivados(req: Request, res: Response, next: NextFunction) {
    try {
      const arquivados = await this.arquivadosRepository.findArquivadosAll(
        undefined,
        { id: 'DESC' }
      );

      return res.status(200).send({
        success: true,
        arquivados
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchArquivadosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        id,
        tab_origem,
        id_origem,
        tab_destino,
        id_destino,
        id_users,
        nomeusers
      } = req.query;

      const arquivados = await this.arquivadosRepository.searchArquivados({
        id: id !== undefined ? Number(id) : undefined,
        tab_origem: tab_origem !== undefined ? String(tab_origem) : undefined,
        id_origem: id_origem !== undefined ? Number(id_origem) : undefined,
        tab_destino:
          tab_destino !== undefined ? String(tab_destino) : undefined,
        id_destino: id_destino !== undefined ? Number(id_destino) : undefined,
        id_users: id_users !== undefined ? Number(id_users) : undefined,
        nomeusers: nomeusers !== undefined ? String(nomeusers) : undefined
      });

      return res.status(200).send({
        success: true,
        arquivados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Histórico de um registro (tab_origem + id_origem) */
  async findAllArquivadosOrigem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tab_origem =
        req.query.tab_origem !== undefined
          ? String(req.query.tab_origem)
          : undefined;
      const id_origem = Number(req.query.id_origem);

      if (!tab_origem) {
        throw new HttpException(400, "Parâmetro 'tab_origem' é obrigatório");
      }

      if (Number.isNaN(id_origem) || id_origem <= 0) {
        throw new HttpException(400, "Parâmetro 'id_origem' inválido");
      }

      const arquivados =
        await this.arquivadosRepository.findAllArquivadosByOrigem(
          tab_origem,
          id_origem
        );

      return res.status(200).send({
        success: true,
        total: arquivados.length,
        arquivados
      });
    } catch (error) {
      next(error);
    }
  }
}
