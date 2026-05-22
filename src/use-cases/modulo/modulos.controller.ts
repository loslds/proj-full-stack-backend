
//C:\repository\proj-full-stack-backend\src\use-cases\modulo\modulos.controller.ts
import { NextFunction, Request, Response } from 'express';
import { ModulosRepository } from './modulos.repository';
import { ModulosCreate, ModulosUpdate } from './modulos.dto';
import { HttpException } from '../../exceptions/HttpException';

export class ModulosController {
  constructor(private readonly modulosRepository: ModulosRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todos os módulos */
  async findAllModulos(req: Request, res: Response, next: NextFunction) {
    try {
      const modulos = await this.modulosRepository.findModulosAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({ success: true, modulos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada por id e nome */
  async searchModulosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome } = req.query;

      const modulos = await this.modulosRepository.searchModulos({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined
      });

      return res.status(200).send({ success: true, modulos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchModulosName(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const modulos = await this.modulosRepository.searchNameModulos(text);

      return res.status(200).send({ success: true, modulos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um módulo pelo nome exato */
  async findOneModulosName(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const modulos = await this.modulosRepository.findOneNameModulos(nome);

      return res.status(200).send({ success: true, modulos });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os módulos com nome exato */
  async findAllModulosName(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const modulos = await this.modulosRepository.findAllNameModulos(nome);

      return res.status(200).send({
        success: true,
        total: modulos.length,
        modulos
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar novo módulo */
  async createNewModulos(
    req: Request<{}, {}, ModulosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome } = req.body;

      if (!nome) {
        throw new HttpException(400, 'Nome do módulo é obrigatório');
      }

      const modulos = await this.modulosRepository.createModulos(req.body);

      return res.status(201).send({ success: true, modulos });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar módulo pelo ID */
  async updateIdModulos(
    req: Request<{ modulosId: string }, {}, ModulosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const modulosId = Number(req.params.modulosId);

      if (!modulosId || Number.isNaN(modulosId) || modulosId <= 0) {
        throw new HttpException(400, 'ID do módulo inválido');
      }

      const modulos = await this.modulosRepository.updateModulos(
        modulosId,
        req.body
      );

      return res.status(200).send({ success: true, modulos });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover módulo */
  async removeIdModulos(
    req: Request<{ modulosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const modulosId = Number(req.params.modulosId);

      if (Number.isNaN(modulosId) || modulosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.modulosRepository.deleteModulos(modulosId);

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar módulo pelo ID */
  async getOneModulosId(
    req: Request<{ modulosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const modulosId = Number(req.params.modulosId);

      if (Number.isNaN(modulosId) || modulosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const modulos = await this.modulosRepository.findModulosById(modulosId);

      return res.status(200).send({ success: true, modulos });
    } catch (error) {
      next(error);
    }
  }
}

