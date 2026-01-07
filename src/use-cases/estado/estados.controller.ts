
//C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.controller.ts
import { NextFunction, Request, Response } from "express";
import { EstadosRepository } from "./estados.repository";
import { EstadosCreate, EstadosUpdate } from "./estados.dto";
import { HttpException } from "../../exceptions/HttpException";

export class EstadosController {
  constructor(private readonly estadosRepository: EstadosRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todas as estados */
async findAllEstados(req: Request, res: Response, next: NextFunction) {
  try {
    const estados = await this.estadosRepository.findEstadosAll(
      undefined,
      { nome: "ASC" }
    );

    return res.status(200).send({ success: true, estados });
  } catch (error) {
    next(error);
  }
}
  /** GET → Pesquisa combinada por id, nome e sigla */
  async searchEstadosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, prefixo } = req.query;

      const estados = await this.estadosRepository.searchEstados({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined,
        prefixo: prefixo ? String(prefixo) : undefined,
      });

      res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const estados = await this.estadosRepository.searchNomeEstados(text);

      res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por sigla aproximada */
  async searchEstadosPrefixo(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const estados = await this.estadosRepository.searchPrefixoEstados(text);

      res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma pessoa pelo nome exato */
  async findOneEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) throw new HttpException(400, "Parâmetro 'nome' é obrigatório");

      const estados = await this.estadosRepository.findOneNomeEstados(nome);

      res.status(200).send({ 
        success: true, 
        estados 
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas pessoas com nome exato */
  async findAllEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) throw new HttpException(400, "Parâmetro 'nome' é obrigatório");

      const estados = await this.estadosRepository.findAllNomeEstados(nome);

      res.status(200).send({
        success: true,
        total: estados.length,
        estados,
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma pessoa pela prefixo exata */
  async findOneEstadosPrefixo(req: Request, res: Response, next: NextFunction) {
    try {
      const prefixo = req.query?.sigla as string;
      if (!prefixo) throw new HttpException(400, "Parâmetro 'prefixo' é obrigatório");

      const estados = await this.estadosRepository.findOnePrefixoEstados(prefixo);

      res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas pessoas com prefixo exato */
  async findAllEstadosPrefixo(req: Request, res: Response, next: NextFunction) {
    try {
      const prefixo = req.query?.prefixo as string;

      if (!prefixo) throw new HttpException(400, "Parâmetro 'prefixo' é obrigatório");

      const estados = await this.estadosRepository.findAllPrefixoEstados(prefixo);

      res.status(200).send({
        success: true,
        total: estados.length,
        estados,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar nova estados */
  async createNewEstados(
    req: Request<{}, {}, EstadosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, prefixo } = req.body;

      if (!nome || !prefixo) throw new HttpException(400, "Nome e prefixo são obrigatórios");

      const duplicated = await this.estadosRepository.hasDuplicated(nome, prefixo);
      if (duplicated) throw new HttpException(400, "Estado já existe");

      const estados = await this.estadosRepository.createEstados(req.body);

      res.status(201).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar estados pelo ID */
  async updateIdEstados(
    req: Request<{ estadosId: string }, {}, EstadosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const estadosId = Number(req.params.estadosId);
      if (!estadosId || isNaN(estadosId) || estadosId <= 0) {
        throw new HttpException(400, "ID da estado inválido");
      }

      const { nome, prefixo } = req.body;

      const duplicated = await this.estadosRepository.hasDuplicated(
        nome,
        prefixo,
        estadosId
      );

      if (duplicated) throw new HttpException(400, "estado já existe");

      const estados = await this.estadosRepository.updateEstados(
        estadosId,
        req.body
      );

      res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover estados */
  async removeIdEstados(
    req: Request<{ estadosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const estadosId = Number(req.params.estadosId);
      if (isNaN(estadosId) || estadosId <= 0) {
        throw new HttpException(400, "ID inválido");
      }

      await this.estadosRepository.deleteEstados(estadosId);

      res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar pessoa pelo ID */
  async getOneEstadosId(
    req: Request<{ estadosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const estadosId = Number(req.params.estadosId);
      if (isNaN(estadosId) || estadosId <= 0) {
        throw new HttpException(400, "ID inválido");
      }

      const estados = await this.estadosRepository.findEstadosById(estadosId);

      res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }
}
