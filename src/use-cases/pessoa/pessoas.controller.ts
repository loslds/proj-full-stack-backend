 
// src/use-cases/pessoa/pessoas.controller.ts
import { NextFunction, Request, Response } from "express";
import { PessoasRepository } from "./pessoas.repository";
import { PessoasCreate, PessoasUpdate } from "./pessoas.dto";
import { HttpException } from "../../exceptions/HttpException";

export class PessoasController {
  constructor(private readonly pessoasRepository: PessoasRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todas as pessoas */
async findAllPessoas(req: Request, res: Response, next: NextFunction) {
  try {
    const pessoas = await this.pessoasRepository.findPessoasAll(
      undefined,
      { nome: "ASC" }
    );

    return res.status(200).send({ success: true, pessoas });
  } catch (error) {
    next(error);
  }
}
  /** GET → Pesquisa combinada por id, nome e sigla */
  async searchPessoasAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, sigla } = req.query;

      const pessoas = await this.pessoasRepository.searchPessoas({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined,
        sigla: sigla ? String(sigla) : undefined,
      });

      res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchPessoasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const pessoas = await this.pessoasRepository.searchNomePessoas(text);

      res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por sigla aproximada */
  async searchPessoasSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const pessoas = await this.pessoasRepository.searchSiglaPessoas(text);

      res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma pessoa pelo nome exato */
  async findOnePessoasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) throw new HttpException(400, "Parâmetro 'nome' é obrigatório");

      const pessoa = await this.pessoasRepository.findOneNomePessoas(nome);

      res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas pessoas com nome exato */
  async findAllPessoasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) throw new HttpException(400, "Parâmetro 'nome' é obrigatório");

      const pessoas = await this.pessoasRepository.findAllNomePessoas(nome);

      res.status(200).send({
        success: true,
        total: pessoas.length,
        pessoas,
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma pessoa pela sigla exata */
  async findOnePessoasSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const sigla = req.query?.sigla as string;
      if (!sigla) throw new HttpException(400, "Parâmetro 'sigla' é obrigatório");

      const pessoa = await this.pessoasRepository.findOneSiglaPessoas(sigla);

      res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas pessoas com sigla exata */
  async findAllPessoasSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const sigla = req.query?.sigla as string;
      if (!sigla) throw new HttpException(400, "Parâmetro 'sigla' é obrigatório");

      const pessoas = await this.pessoasRepository.findAllSiglaPessoas(sigla);

      res.status(200).send({
        success: true,
        total: pessoas.length,
        pessoas,
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar nova pessoa */
  async createNewPessoas(
    req: Request<{}, {}, PessoasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, sigla } = req.body;

      if (!nome || !sigla) throw new HttpException(400, "Nome e sigla são obrigatórios");

      const duplicated = await this.pessoasRepository.hasDuplicated(nome, sigla);
      if (duplicated) throw new HttpException(400, "Pessoa já existe");

      const pessoa = await this.pessoasRepository.createPessoas(req.body);

      res.status(201).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar pessoa pelo ID */
  async updateIdPessoas(
    req: Request<{ pessoasId: string }, {}, PessoasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);
      if (!pessoasId || isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, "ID da pessoa inválido");
      }

      const { nome, sigla } = req.body;

      const duplicated = await this.pessoasRepository.hasDuplicated(
        nome,
        sigla,
        pessoasId
      );

      if (duplicated) throw new HttpException(400, "Pessoa já existe");

      const pessoa = await this.pessoasRepository.updatePessoas(
        pessoasId,
        req.body
      );

      res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover pessoa */
  async removeIdPessoas(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);
      if (isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, "ID inválido");
      }

      await this.pessoasRepository.deletePessoas(pessoasId);

      res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar pessoa pelo ID */
  async getOnePessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);
      if (isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, "ID inválido");
      }

      const pessoa = await this.pessoasRepository.findPessoasById(pessoasId);

      res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }
}
