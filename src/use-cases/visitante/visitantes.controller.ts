
 // C:\repository\proj-full-stack-backend\src\use-cases\visitante\visitantes.controller.ts
import { NextFunction, Request, Response } from 'express';
import { VisitantesRepository } from './visitantes.repository';
import { VisitantesCreate, VisitantesUpdate } from './visitantes.dto';
import { HttpException } from '../../exceptions/HttpException';

export class VisitantesController {
  constructor(private readonly visitantesRepository: VisitantesRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo visitante */
  async createNewVisitantes(
    req: Request<{}, {}, VisitantesCreate>,
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

      const duplicated = await this.visitantesRepository.hasDuplicated(
        nome,
        fantasy,
        id_pessoas,
        id_empresas
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe visitante com os dados informados.'
        );
      }

      const visitantes = await this.visitantesRepository.createVisitantes(req.body);

      return res.status(201).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar visitante pelo ID */
  async updateIdVisitantes(
    req: Request<{ visitantesId: string }, {}, VisitantesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID do visitante inválido');
      }

      const payload = req.body;

      const duplicated = await this.visitantesRepository.hasDuplicated(
        payload.nome,
        payload.fantasy,
        payload.id_pessoas,
        payload.id_empresas,
        [visitantesId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe visitante com os dados informados.'
        );
      }

      const visitantes = await this.visitantesRepository.updateVisitantesId(
        visitantesId,
        payload
      );

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover visitante */
  async removeIdVisitantes(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.visitantesRepository.deleteVisitantesId(visitantesId);

      return res.status(200).send({
        success: true,
        message: `Visitante ID ${visitantesId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar visitante pelo ID */
  async getOneVisitantesId(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const visitantes = await this.visitantesRepository.findOneVisitantesById(
        visitantesId
      );

      if (!visitantes) {
        throw new HttpException(
          404,
          `Visitante ID ${visitantesId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os visitantes */
  async findAllVisitantes(req: Request, res: Response, next: NextFunction) {
    try {
      const visitantes = await this.visitantesRepository.findVisitantesAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome, fantasy, pessoa e empresa */
  async searchVisitantesAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy, id_pessoas, id_empresas } = req.query;

      const visitantes = await this.visitantesRepository.searchVisitantes({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        fantasy: fantasy !== undefined ? String(fantasy) : undefined,
        id_pessoas: id_pessoas !== undefined ? Number(id_pessoas) : undefined,
        id_empresas: id_empresas !== undefined ? Number(id_empresas) : undefined
      });

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchVisitantesNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const visitantes =
        await this.visitantesRepository.searchNameParcialVisitantes(text);

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado */
  async searchVisitantesFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const visitantes =
        await this.visitantesRepository.searchFantasyParcialVisitantes(text);

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um visitante pelo nome exato */
  async findOneVisitantesNome(
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

      const visitantes =
        await this.visitantesRepository.findOneVisitantesByNome(nome);

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os visitantes com nome exato */
  async findAllVisitantesNome(
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

      const visitantes =
        await this.visitantesRepository.findAllVisitantesByNome(nome);

      return res.status(200).send({
        success: true,
        total: visitantes.length,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um visitante pelo fantasy exato */
  async findOneVisitantesFantasy(
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

      const visitantes =
        await this.visitantesRepository.findOneVisitantesByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os visitantes com fantasy exato */
  async findAllVisitantesFantasy(
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

      const visitantes =
        await this.visitantesRepository.findAllVisitantesByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        total: visitantes.length,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os visitantes por pessoa */
  async findAllVisitantesPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const visitantes =
        await this.visitantesRepository.findAllVisitantesByPessoasId(pessoasId);

      return res.status(200).send({
        success: true,
        total: visitantes.length,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os visitantes por empresa */
  async findAllVisitantesEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const visitantes =
        await this.visitantesRepository.findAllVisitantesByEmpresasId(empresasId);

      return res.status(200).send({
        success: true,
        total: visitantes.length,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista visitantes com detalhes */
  async listAllVisitantesDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantes =
        await this.visitantesRepository.listAllVisitantesDetails();

      return res.status(200).send({
        success: true,
        visitantes
      });
    } catch (error) {
      next(error);
    }
  }
}