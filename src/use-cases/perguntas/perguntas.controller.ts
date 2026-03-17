
//C:\repository\proj-full-stack-backend\src\use-cases\perguntas\perguntas.controller.ts
import { NextFunction, Request, Response } from 'express';
import { PerguntasRepository } from './perguntas.repository';
import { PerguntasCreate, PerguntasUpdate } from './perguntas.dto';
import { HttpException } from '../../exceptions/HttpException';

export class PerguntasController {
  constructor(private readonly perguntasRepository: PerguntasRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todas as perguntas */
  async findAllPerguntas(req: Request, res: Response, next: NextFunction) {
    try {
      const perguntas = await this.perguntasRepository.findPerguntasAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada */
  async searchPerguntasAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome } = req.query;

      const perguntas = await this.perguntasRepository.searchPerguntas({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined
      });

      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchPerguntasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const perguntas = await this.perguntasRepository.searchNomePerguntas(text);

      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma pergunta pelo nome exato */
  async findOnePerguntasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const perguntas = await this.perguntasRepository.findOneNomePerguntas(nome);

      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as perguntas com nome exato */
  async findAllPerguntasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const perguntas = await this.perguntasRepository.findAllNomePerguntas(nome);

      return res.status(200).send({
        success: true,
        total: perguntas.length,
        perguntas
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar nova pergunta */
  async createNewPerguntas(
    req: Request<{}, {}, PerguntasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome } = req.body;

      if (!nome) {
        throw new HttpException(400, 'Nome da pergunta é obrigatório');
      }

      const perguntas = await this.perguntasRepository.createPerguntas(req.body);

      return res.status(201).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar pergunta pelo ID */
  async updateIdPerguntas(
    req: Request<{ perguntasId: string }, {}, PerguntasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const perguntasId = Number(req.params.perguntasId);

      if (!perguntasId || Number.isNaN(perguntasId) || perguntasId <= 0) {
        throw new HttpException(400, 'ID da pergunta inválido');
      }

      const perguntas = await this.perguntasRepository.updatePerguntas(
        perguntasId,
        req.body
      );

      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover pergunta */
  async removeIdPerguntas(
    req: Request<{ perguntasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const perguntasId = Number(req.params.perguntasId);

      if (Number.isNaN(perguntasId) || perguntasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.perguntasRepository.deletePerguntas(perguntasId);

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar pergunta pelo ID */
  async getOnePerguntasId(
    req: Request<{ perguntasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const perguntasId = Number(req.params.perguntasId);

      if (Number.isNaN(perguntasId) || perguntasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const perguntas = await this.perguntasRepository.findPerguntasById(perguntasId);

      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }
}