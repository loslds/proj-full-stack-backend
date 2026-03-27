
 // C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.controller.ts
import { NextFunction, Request, Response } from 'express';
import { EstadosRepository } from './estados.repository';
import { EstadosCreate, EstadosUpdate } from './estados.dto';
import { HttpException } from '../../exceptions/HttpException';

export class EstadosController {
  constructor(private readonly estadosRepository: EstadosRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo estado */
  async createNewEstados(
    req: Request<{}, {}, EstadosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, prefixo } = req.body;

      if (!nome || !prefixo) {
        throw new HttpException(400, 'Nome e prefixo são obrigatórios');
      }

      const estados = await this.estadosRepository.createEstados(req.body);

      return res.status(201).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar estado pelo ID */
  async updateIdEstados(
    req: Request<{ estadosId: string }, {}, EstadosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const estadosId = Number(req.params.estadosId);

      if (Number.isNaN(estadosId) || estadosId <= 0) {
        throw new HttpException(400, 'ID do estado inválido');
      }

      const estados = await this.estadosRepository.updateEstados(
        estadosId,
        req.body
      );

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover estado */
  async removeIdEstados(
    req: Request<{ estadosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const estadosId = Number(req.params.estadosId);

      if (Number.isNaN(estadosId) || estadosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.estadosRepository.deleteEstados(estadosId);

      return res.status(200).send({
        success: true
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar estado pelo ID */
  async getOneEstadosId(
    req: Request<{ estadosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const estadosId = Number(req.params.estadosId);

      if (Number.isNaN(estadosId) || estadosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const estados = await this.estadosRepository.findEstadosById(estadosId);

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os estados */
  async findAllEstados(req: Request, res: Response, next: NextFunction) {
    try {
      const estados = await this.estadosRepository.findEstadosAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome e prefixo */
  async searchEstadosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, prefixo } = req.query;

      const estados = await this.estadosRepository.searchEstados({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        prefixo: prefixo !== undefined ? String(prefixo) : undefined
      });

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text !== undefined ? String(req.query.text) : undefined;

      const estados = await this.estadosRepository.searchNomeEstados(text);

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por prefixo aproximado */
  async searchEstadosPrefixo(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text !== undefined ? String(req.query.text) : undefined;

      const estados = await this.estadosRepository.searchPrefixoEstados(text);

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um estado pelo nome exato */
  async findOneEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const estados = await this.estadosRepository.findOneNomeEstados(nome);

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os estados com nome exato */
  async findAllEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const estados = await this.estadosRepository.findAllNomeEstados(nome);

      return res.status(200).send({
        success: true,
        total: estados.length,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um estado pelo prefixo exato */
  async findOneEstadosPrefixo(req: Request, res: Response, next: NextFunction) {
    try {
      const prefixo = req.query.prefixo !== undefined
        ? String(req.query.prefixo)
        : undefined;

      if (!prefixo) {
        throw new HttpException(400, "Parâmetro 'prefixo' é obrigatório");
      }

      const estados = await this.estadosRepository.findOnePrefixoEstados(prefixo);

      return res.status(200).send({
        success: true,
        estados
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os estados com prefixo exato */
  async findAllEstadosPrefixo(req: Request, res: Response, next: NextFunction) {
    try {
      const prefixo = req.query.prefixo !== undefined
        ? String(req.query.prefixo)
        : undefined;

      if (!prefixo) {
        throw new HttpException(400, "Parâmetro 'prefixo' é obrigatório");
      }

      const estados = await this.estadosRepository.findAllPrefixoEstados(prefixo);

      return res.status(200).send({
        success: true,
        total: estados.length,
        estados
      });
    } catch (error) {
      next(error);
    }
  }
}