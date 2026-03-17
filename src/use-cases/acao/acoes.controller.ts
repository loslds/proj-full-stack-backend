
//C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes.repository.ts
import { NextFunction, Request, Response } from 'express';
import { AcoesRepository } from './acoes.repository';
import { AcoesCreate, AcoesUpdate } from './acoes.dto';
import { HttpException } from '../../exceptions/HttpException';

export class AcoesController {
  constructor(private readonly acoesRepository: AcoesRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todas as ações */
  async findAllAcoes(req: Request, res: Response, next: NextFunction) {
    try {
      const acoes = await this.acoesRepository.findAcoesAll(
        undefined,
        { nivel: 'ASC' }
      );

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada por id, nome, abrev e nivel */
  async searchAcoesAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, abrev, nivel } = req.query;

      const acoes = await this.acoesRepository.searchAcoes({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined,
        abrev: abrev ? String(abrev) : undefined,
        nivel: nivel ? Number(nivel) : undefined
      });

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchAcoesNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const acoes = await this.acoesRepository.searchNomeAcoes(text);

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por abreviação aproximada */
  async searchAcoesAbrev(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const acoes = await this.acoesRepository.searchAbrevAcoes(text);

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma ação pelo nome exato */
  async findOneAcoesNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const acoes = await this.acoesRepository.findOneNomeAcoes(nome);

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as ações com nome exato */
  async findAllAcoesNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const acoes = await this.acoesRepository.findAllNomeAcoes(nome);

      return res.status(200).send({
        success: true,
        total: acoes.length,
        acoes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma ação pela abreviação exata */
  async findOneAcoesAbrev(req: Request, res: Response, next: NextFunction) {
    try {
      const abrev = req.query?.abrev as string;

      if (!abrev) {
        throw new HttpException(400, "Parâmetro 'abrev' é obrigatório");
      }

      const acoes = await this.acoesRepository.findOneAbrevAcoes(abrev);

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as ações com abreviação exata */
  async findAllAcoesAbrev(req: Request, res: Response, next: NextFunction) {
    try {
      const abrev = req.query?.abrev as string;

      if (!abrev) {
        throw new HttpException(400, "Parâmetro 'abrev' é obrigatório");
      }

      const acoes = await this.acoesRepository.findAllAbrevAcoes(abrev);

      return res.status(200).send({
        success: true,
        total: acoes.length,
        acoes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma ação pelo nível exato */
  async findOneAcoesNivel(req: Request, res: Response, next: NextFunction) {
    try {
      const nivel = req.query?.nivel ? Number(req.query.nivel) : undefined;

      if (!nivel || Number.isNaN(nivel) || nivel <= 0) {
        throw new HttpException(400, "Parâmetro 'nivel' é obrigatório");
      }

      const acoes = await this.acoesRepository.findOneNivelAcoes(nivel);

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as ações com nível exato */
  async findAllAcoesNivel(req: Request, res: Response, next: NextFunction) {
    try {
      const nivel = req.query?.nivel ? Number(req.query.nivel) : undefined;

      if (!nivel || Number.isNaN(nivel) || nivel <= 0) {
        throw new HttpException(400, "Parâmetro 'nivel' é obrigatório");
      }

      const acoes = await this.acoesRepository.findAllNivelAcoes(nivel);

      return res.status(200).send({
        success: true,
        total: acoes.length,
        acoes
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar nova ação */
  async createNewAcoes(
    req: Request<{}, {}, AcoesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, abrev, cor, nivel } = req.body;

      if (!nome || !abrev || !cor || !nivel) {
        throw new HttpException(400, 'Nome, abrev, cor e nivel são obrigatórios');
      }

      const acoes = await this.acoesRepository.createAcoes(req.body);

      return res.status(201).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar ação pelo ID */
  async updateIdAcoes(
    req: Request<{ acoesId: string }, {}, AcoesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const acoesId = Number(req.params.acoesId);

      if (!acoesId || Number.isNaN(acoesId) || acoesId <= 0) {
        throw new HttpException(400, 'ID da ação inválido');
      }

      const acoes = await this.acoesRepository.updateAcoes(
        acoesId,
        req.body
      );

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover ação */
  async removeIdAcoes(
    req: Request<{ acoesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const acoesId = Number(req.params.acoesId);

      if (Number.isNaN(acoesId) || acoesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.acoesRepository.deleteAcoes(acoesId);

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar ação pelo ID */
  async getOneAcoesId(
    req: Request<{ acoesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const acoesId = Number(req.params.acoesId);

      if (Number.isNaN(acoesId) || acoesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const acoes = await this.acoesRepository.findAcoesById(acoesId);

      return res.status(200).send({ success: true, acoes });
    } catch (error) {
      next(error);
    }
  }
}