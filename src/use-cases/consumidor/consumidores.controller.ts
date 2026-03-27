
// C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.controller.ts
// C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.controller.ts
import { NextFunction, Request, Response } from 'express';
import { ConsumidoresRepository } from './consumidores.repository';
import { ConsumidoresCreate, ConsumidoresUpdate } from './consumidores.dto';
import { HttpException } from '../../exceptions/HttpException';

export class ConsumidoresController {
  constructor(private readonly consumidoresRepository: ConsumidoresRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo consumidor */
  async createNewConsumidores(
    req: Request<{}, {}, ConsumidoresCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, fantasy, id_pessoas, id_empresas } = req.body;

      if (!nome || !fantasy || !id_pessoas || !id_empresas) {
        throw new HttpException(
          400,
          'Nome, fantasy, id_pessoas e id_empresas são obrigatórios'
        );
      }

      const duplicated = await this.consumidoresRepository.hasDuplicated(
        nome,
        fantasy,
        id_pessoas,
        id_empresas
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe consumidor com os dados informados.'
        );
      }

      const consumidores = await this.consumidoresRepository.createConsumidores(
        req.body
      );

      return res.status(201).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar consumidor pelo ID */
  async updateIdConsumidores(
    req: Request<{ consumidoresId: string }, {}, ConsumidoresUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidoresId = Number(req.params.consumidoresId);

      if (Number.isNaN(consumidoresId) || consumidoresId <= 0) {
        throw new HttpException(400, 'ID do consumidor inválido');
      }

      const payload = req.body;

      const duplicated = await this.consumidoresRepository.hasDuplicated(
        payload.nome,
        payload.fantasy,
        payload.id_pessoas,
        payload.id_empresas,
        [consumidoresId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe consumidor com os dados informados.'
        );
      }

      const consumidores =
        await this.consumidoresRepository.updateConsumidoresId(
          consumidoresId,
          payload
        );

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover consumidor */
  async removeIdConsumidores(
    req: Request<{ consumidoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidoresId = Number(req.params.consumidoresId);

      if (Number.isNaN(consumidoresId) || consumidoresId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.consumidoresRepository.deleteConsumidoresId(consumidoresId);

      return res.status(200).send({
        success: true,
        message: `Consumidor ID ${consumidoresId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar consumidor pelo ID */
  async getOneConsumidoresId(
    req: Request<{ consumidoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidoresId = Number(req.params.consumidoresId);

      if (Number.isNaN(consumidoresId) || consumidoresId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const consumidores =
        await this.consumidoresRepository.findOneConsumidoresById(
          consumidoresId
        );

      if (!consumidores) {
        throw new HttpException(
          404,
          `Consumidor ID ${consumidoresId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os consumidores */
  async findAllConsumidores(req: Request, res: Response, next: NextFunction) {
    try {
      const consumidores = await this.consumidoresRepository.findConsumidoresAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome, fantasy, pessoa e empresa */
  async searchConsumidoresAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, nome, fantasy, id_pessoas, id_empresas } = req.query;

      const consumidores = await this.consumidoresRepository.searchConsumidores({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        fantasy: fantasy !== undefined ? String(fantasy) : undefined,
        id_pessoas: id_pessoas !== undefined ? Number(id_pessoas) : undefined,
        id_empresas: id_empresas !== undefined ? Number(id_empresas) : undefined
      });

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchConsumidoresNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const consumidores =
        await this.consumidoresRepository.searchNameParcialConsumidores(text);

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado */
  async searchConsumidoresFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const consumidores =
        await this.consumidoresRepository.searchFantasyParcialConsumidores(text);

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um consumidor pelo nome exato */
  async findOneConsumidoresNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome =
        req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const consumidores =
        await this.consumidoresRepository.findOneConsumidoresByNome(nome);

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os consumidores com nome exato */
  async findAllConsumidoresNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome =
        req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const consumidores =
        await this.consumidoresRepository.findAllConsumidoresByNome(nome);

      return res.status(200).send({
        success: true,
        total: consumidores.length,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um consumidor pelo fantasy exato */
  async findOneConsumidoresFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fantasy =
        req.query.fantasy !== undefined ? String(req.query.fantasy) : undefined;

      if (!fantasy) {
        throw new HttpException(400, "Parâmetro 'fantasy' é obrigatório");
      }

      const consumidores =
        await this.consumidoresRepository.findOneConsumidoresByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os consumidores com fantasy exato */
  async findAllConsumidoresFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fantasy =
        req.query.fantasy !== undefined ? String(req.query.fantasy) : undefined;

      if (!fantasy) {
        throw new HttpException(400, "Parâmetro 'fantasy' é obrigatório");
      }

      const consumidores =
        await this.consumidoresRepository.findAllConsumidoresByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        total: consumidores.length,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os consumidores por pessoa */
  async findAllConsumidoresPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const consumidores =
        await this.consumidoresRepository.findAllConsumidoresByPessoasId(
          pessoasId
        );

      return res.status(200).send({
        success: true,
        total: consumidores.length,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os consumidores por empresa */
  async findAllConsumidoresEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const consumidores =
        await this.consumidoresRepository.findAllConsumidoresByEmpresasId(
          empresasId
        );

      return res.status(200).send({
        success: true,
        total: consumidores.length,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista consumidores com detalhes */
  async listAllConsumidoresDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidores =
        await this.consumidoresRepository.listAllConsumidoresDetails();

      return res.status(200).send({
        success: true,
        consumidores
      });
    } catch (error) {
      next(error);
    }
  }
}