

// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.controller.ts
import { Request, Response, NextFunction } from 'express';
import { VisitasRepository } from './visitas.repository';
import { VisitasCreate } from './visitas.dto';
import { HttpException } from '../../exceptions/HttpException';

export class VisitasController {
  constructor(private readonly visitasRepository: VisitasRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todas as visitas */
  async findAllVisitas(req: Request, res: Response, next: NextFunction) {
    try {
      const visitas = await this.visitasRepository.findVisitasAll(
        undefined,
        { createdAt: 'DESC' }
      );

      return res.status(200).send({ success: true, visitas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada por id, id_visitantes, nome e fantasy */
  async searchVisitasAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, id_visitantes, nome, fantasy } = req.query;

      const visitas = await this.visitasRepository.searchVisitas({
        id: id ? Number(id) : undefined,
        id_visitantes: id_visitantes ? Number(id_visitantes) : undefined,
        nome: nome ? String(nome) : undefined,
        fantasy: fantasy ? String(fantasy) : undefined
      });

      return res.status(200).send({ success: true, visitas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado do visitante */
  async searchVisitasNomeVisitante(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const visitas =
        await this.visitasRepository.searchVisitasByNomeVisitante(text);

      return res.status(200).send({ success: true, visitas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado do visitante */
  async searchVisitasFantasyVisitante(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const visitas =
        await this.visitasRepository.searchVisitasByFantasyVisitante(text);

      return res.status(200).send({ success: true, visitas });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar histórico de visitas por id_visitantes */
  async findHistoricoVisitasVisitantesId(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (!visitantesId || Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID do visitante inválido');
      }

      const visitas =
        await this.visitasRepository.findHistoricoVisitasByVisitantesId(visitantesId);

      return res.status(200).send({
        success: true,
        total: visitas.length,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar histórico de visitas por nome do visitante */
  async findHistoricoVisitasNomeVisitante(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const visitas =
        await this.visitasRepository.findHistoricoVisitasByNomeVisitante(nome);

      return res.status(200).send({
        success: true,
        total: visitas.length,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar histórico de visitas por fantasy do visitante */
  async findHistoricoVisitasFantasyVisitante(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fantasy = req.query?.fantasy as string;

      if (!fantasy) {
        throw new HttpException(400, "Parâmetro 'fantasy' é obrigatório");
      }

      const visitas =
        await this.visitasRepository.findHistoricoVisitasByFantasyVisitante(fantasy);

      return res.status(200).send({
        success: true,
        total: visitas.length,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as visitas por id_visitantes */
  async findAllVisitasVisitantesId(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (!visitantesId || Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID do visitante inválido');
      }

      const visitas =
        await this.visitasRepository.findAllVisitasByVisitantesId(visitantesId);

      return res.status(200).send({
        success: true,
        total: visitas.length,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista visitas com detalhes */
  async listAllVisitasDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitas = await this.visitasRepository.listAllVisitasDetails();

      return res.status(200).send({
        success: true,
        total: visitas.length,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar visita pelo ID */
  async getOneVisitasId(
    req: Request<{ visitasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitasId = Number(req.params.visitasId);

      if (Number.isNaN(visitasId) || visitasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const visitas = await this.visitasRepository.findOneVisitasById(visitasId);

      return res.status(200).send({ success: true, visitas });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // ENTRADA E SAÍDA
  // =========================================================================

  /** POST → Registrar entrada do visitante */
  async registerEntradaVisitas(
    req: Request<{}, {}, VisitasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id_visitantes } = req.body;

      if (!id_visitantes || Number.isNaN(Number(id_visitantes)) || Number(id_visitantes) <= 0) {
        throw new HttpException(400, 'ID do visitante inválido');
      }

      const visitas = await this.visitasRepository.registerEntradaVisitas(req.body);

      return res.status(201).send({ success: true, visitas });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Registrar saída do visitante e calcular tempo_visita */
  async registerSaidaVisitas(
    req: Request<{ visitasId: string }, {}, { updatedBy?: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitasId = Number(req.params.visitasId);

      if (!visitasId || Number.isNaN(visitasId) || visitasId <= 0) {
        throw new HttpException(400, 'ID da visita inválido');
      }

      const visitas = await this.visitasRepository.registerSaidaVisitas(
        visitasId,
        req.body.updatedBy ?? 0
      );

      return res.status(200).send({ success: true, visitas });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover visita */
  async removeIdVisitas(
    req: Request<{ visitasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitasId = Number(req.params.visitasId);

      if (Number.isNaN(visitasId) || visitasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.visitasRepository.deleteVisitasId(visitasId);

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }
}