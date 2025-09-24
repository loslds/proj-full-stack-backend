// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.controller.ts


import { NextFunction, Request, Response } from "express";
import { PessoasRepository } from "./pessoas.repository";
import { PessoasCreate, PessoasUpdate } from "./pessoas.dto";
import { PessoasEntity } from "./pessoas.entity";
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type PessoasDto = DeepPartial<PessoasEntity>;
import { HttpException } from "../../middlewares/HttpException";

export class PessoasController {
  constructor(private readonly pessoasRepository: PessoasRepository) {}

  /** POST Cria um novo registro de Pessoas */
  async create(
    req: Request<{}, {}, PessoasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, sigla } = req.body;
      const exists = await this.pessoasRepository.hasDuplicated(nome, sigla);
      if (exists) throw new HttpException(400, "Pessoa já existe");

      const pessoas = await this.pessoasRepository.createPessoas(req.body);
      return res.status(201).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Pessoa */
  async update(
    req: Request<{ pessoasId: string }, {}, PessoasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params?.pessoasId);
      if (!pessoasId) throw new HttpException(400, "ID da pessoa inválido");

      const { nome, sigla } = req.body;
      const exists = await this.pessoasRepository.hasDuplicated(nome, sigla, [pessoasId]);
      if (exists) throw new HttpException(400, "Pessoa já existe");

      const pessoas = await this.pessoasRepository.updatePessoas(pessoasId, req.body);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Pessoas */
  async remove(req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) {
    try {
      const pessoasId = Number(req.params.pessoasId);
      if (isNaN(pessoasId) || pessoasId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }
      await this.pessoasRepository.deletePessoas(pessoasId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Pessoas */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<PessoasEntity> | undefined;

      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<PessoasEntity>;
      }

      const pessoas = await this.pessoasRepository.findPessoasAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, pessoas });

    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoas por ID */
  async getOne(req: Request<{ pessoasId: string }>, res: Response, next: NextFunction) {
    try {
      const pessoasId = Number(req.params.pessoasId);
      if (isNaN(pessoasId) || pessoasId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }

      const pessoas = await this.pessoasRepository.findPessoasById(pessoasId);
      return res.status(200).send({ success: true, pessoas });

    } catch (error) {
      next(error);
    }
  }


  /** GET pesquisa Buscar registros de Pessoa por ID/nome/sigla (query) */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, sigla } = req.query;
      const pessoas = await this.pessoasRepository.searchPessoas({
        id: id ? Number(id) : undefined,
        nome: nome as string,
        sigla: sigla as string,
      });
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET pesquisa Buscar por nome em Pessoas */
  async searchName(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query?.text as string;
      const pessoas = await this.pessoasRepository.searchNamePessoas(text);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET pesquisa Buscar por Sigla em Pessoas */
  async searchSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query?.text as string;
      const pessoas = await this.pessoasRepository.searchSiglaPessoas(text);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa por nome */
  async findOneNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) {
        return res.status(400).send({ success: false, message: "Parâmetro 'nome' é obrigatório" });
      }

      const pessoas = await this.pessoasRepository.findOneNomePessoas(nome);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Pessoa por nome */
  async findAllNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) {
        return res.status(400).send({ success: false, message: "Parâmetro 'nome' é obrigatório" });
      }

      const pessoas = await this.pessoasRepository.findAllNomePessoas(nome);
      if (pessoas.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma pessoa encontrada com esse nome" });
      }

      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa por sigla */
  async findOneSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const sigla = req.query?.sigla as string;
      if (!sigla) {
        return res.status(400).send({ success: false, message: "Parâmetro 'sigla' é obrigatório" });
      }

      const pessoas = await this.pessoasRepository.findOneSiglaPessoas(sigla);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Pessoa por sigla */
  async findAllSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const sigla = req.query?.sigla as string;
      if (!sigla) {
        return res.status(400).send({ success: false, message: "Parâmetro 'sigla' é obrigatório" });
      }

      const pessoas = await this.pessoasRepository.findAllSiglaPessoas(sigla);
      if (pessoas.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma pessoa encontrada com essa sigla" });
      }

      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }
}
