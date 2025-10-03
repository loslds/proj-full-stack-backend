
//C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.controller.ts

import { NextFunction, Request, Response } from "express";
import { EstadosRepository } from "./estados.repository";
import { EstadosCreate, EstadosUpdate } from "./estados.dto";
import { EstadosEntity } from "./estados.entity";
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type EstadosDto = DeepPartial<EstadosEntity>;
import { HttpException } from "../../middlewares/HttpException";

export class EstadosController {
  constructor(private readonly estadosRepository: EstadosRepository) {}

  /** GET Busca todos os registros */
  async findAllEstados(req: Request, res: Response, next: NextFunction) {
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<EstadosEntity> | undefined;

      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<EstadosEntity>;
      }

      const estados = await this.estadosRepository.findEstadosAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, estados });

    } catch (error) {
      next(error);
    }
  }

    /** GET pesquisa Buscar registros de Pessoa por ID/nome/sigla (query) */
  async searchEstadosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, uf } = req.query;
      const estados = await this.estadosRepository.searchEstados({
        id: id ? Number(id) : undefined,
        nome: nome as string,
        uf: uf as string,
      });
      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET pesquisa Buscar por nome */
  async searchEstadosName(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query?.text as string;
      const estados = await this.estadosRepository.searchNameEstados(text);
      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET pesquisa Buscar por Uf */
  async searchEstadosUf(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query?.text as string;
      const estados = await this.estadosRepository.searchUfEstados(text);
      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de nome */
  async findOneEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) {
        return res.status(400).send({ success: false, message: "Parâmetro 'nome' é obrigatório" });
      }

      const estados = await this.estadosRepository.findOneNomeEstados(nome);
      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros por nome */
  async findAllEstadosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) {
        return res.status(400).send({ success: false, message: "Parâmetro 'nome' é obrigatório" });
      }

      const estados = await this.estadosRepository.findAllNomeEstados(nome);
      if (estados.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma pessoa encontrada com esse nome" });
      }

      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro por uf */
  async findOneEstadosUf(req: Request, res: Response, next: NextFunction) {
    try {
      const uf = req.query?.uf as string;
      if (!uf) {
        return res.status(400).send({ success: false, message: "Parâmetro 'uf' é obrigatório" });
      }

      const estados = await this.estadosRepository.findOneUfEstados(uf);
      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros por uf */
  async findAllEstadosUf(req: Request, res: Response, next: NextFunction) {
    try {
      const uf = req.query?.uf as string;
      if (!uf) {
        return res.status(400).send({ success: false, message: "Parâmetro 'uf' é obrigatório" });
      }

      const estados = await this.estadosRepository.findAllUfEstados(uf);
      if (estados.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma estados encontrado com essa uf" });
      }

      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }



  /** POST Cria um novo registro de Pessoas */
  async createNewEstados(
    req: Request<{}, {}, EstadosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, uf } = req.body;
      const exists = await this.estadosRepository.hasDuplicated(nome, uf);
      if (exists) throw new HttpException(400, "Estado já existe");

      const estados = await this.estadosRepository.createEstados(req.body);
      return res.status(201).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Pessoa */
  async updateIdEstados(
    req: Request<{ estadosId: string }, {}, EstadosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const estadosId = Number(req.params?.estadosId);
      if (!estadosId) throw new HttpException(400, "ID da estados inválido");

      const { nome, uf } = req.body;
      const exists = await this.estadosRepository.hasDuplicated(nome, uf, [estadosId]);
      if (exists) throw new HttpException(400, "Estado já existe");

      const estados = await this.estadosRepository.updateEstados(estadosId, req.body);
      return res.status(200).send({ success: true, estados });
    } catch (error) {
      next(error);
    }
  }

  
  /** DELETE Remove um registro de Pessoas */
  async removeIdEstados(req: Request<{ estadosId: string }>, res: Response, next: NextFunction) {
    try {
      const estadosId = Number(req.params.estadosId);
      if (isNaN(estadosId) || estadosId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }
      await this.estadosRepository.deleteEstados(estadosId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Busca um registro de ID */
  async getOneEstadosId(req: Request<{ estadosId: string }>, res: Response, next: NextFunction) {
    try {
      const estadosId = Number(req.params.estadosId);
      if (isNaN(estadosId) || estadosId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }

      const estados = await this.estadosRepository.findEstadosById(estadosId);
      return res.status(200).send({ success: true, estados });

    } catch (error) {
      next(error);
    }
  }
  
}
