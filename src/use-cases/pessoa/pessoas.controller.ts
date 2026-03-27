 
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.controller.ts
import { NextFunction, Request, Response } from 'express';
import { PessoasRepository } from './pessoas.repository';
import { PessoasCreate, PessoasUpdate } from './pessoas.dto';
import { HttpException } from '../../exceptions/HttpException';

export class PessoasController {
  constructor(private readonly pessoasRepository: PessoasRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar nova pessoa */
  async createNewPessoas(
    req: Request<{}, {}, PessoasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, sigla } = req.body;

      if (!nome || !sigla) {
        throw new HttpException(400, 'Nome e sigla são obrigatórios');
      }

      const pessoas = await this.pessoasRepository.createPessoas(req.body);

      return res.status(201).send({
        success: true,
        pessoas
      });
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

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const pessoas = await this.pessoasRepository.updatePessoas(
        pessoasId,
        req.body
      );

      return res.status(200).send({
        success: true,
        pessoas
      });
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

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.pessoasRepository.deletePessoas(pessoasId);

      return res.status(200).send({
        success: true
      });
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

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const pessoas = await this.pessoasRepository.findPessoasById(pessoasId);

      return res.status(200).send({
        success: true,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todas as pessoas */
  async findAllPessoas(req: Request, res: Response, next: NextFunction) {
    try {
      const pessoas = await this.pessoasRepository.findPessoasAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome e sigla */
  async searchPessoasAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, sigla } = req.query;

      const pessoas = await this.pessoasRepository.searchPessoas({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        sigla: sigla !== undefined ? String(sigla) : undefined
      });

      return res.status(200).send({
        success: true,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchPessoasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text !== undefined ? String(req.query.text) : undefined;
      const pessoas = await this.pessoasRepository.searchNomePessoas(text);

      return res.status(200).send({
        success: true,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por sigla aproximada */
  async searchPessoasSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text !== undefined ? String(req.query.text) : undefined;
      const pessoas = await this.pessoasRepository.searchSiglaPessoas(text);

      return res.status(200).send({
        success: true,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma pessoa pelo nome exato */
  async findOnePessoasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const pessoas = await this.pessoasRepository.findOneNomePessoas(nome);

      return res.status(200).send({
        success: true,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as pessoas com nome exato */
  async findAllPessoasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const pessoas = await this.pessoasRepository.findAllNomePessoas(nome);

      return res.status(200).send({
        success: true,
        total: pessoas.length,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma pessoa pela sigla exata */
  async findOnePessoasSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const sigla = req.query.sigla !== undefined ? String(req.query.sigla) : undefined;

      if (!sigla) {
        throw new HttpException(400, "Parâmetro 'sigla' é obrigatório");
      }

      const pessoas = await this.pessoasRepository.findOneSiglaPessoas(sigla);

      return res.status(200).send({
        success: true,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as pessoas com sigla exata */
  async findAllPessoasSigla(req: Request, res: Response, next: NextFunction) {
    try {
      const sigla = req.query.sigla !== undefined ? String(req.query.sigla) : undefined;

      if (!sigla) {
        throw new HttpException(400, "Parâmetro 'sigla' é obrigatório");
      }

      const pessoas = await this.pessoasRepository.findAllSiglaPessoas(sigla);

      return res.status(200).send({
        success: true,
        total: pessoas.length,
        pessoas
      });
    } catch (error) {
      next(error);
    }
  }
}