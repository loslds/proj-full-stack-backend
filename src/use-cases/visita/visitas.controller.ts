

// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.controller.ts

import { NextFunction, Request, Response } from 'express';
import { VisitasRepository } from './visitas.repository';
import { VisitasCreate, VisitasUpdate } from './visitas.dto';
import { HttpException } from '../../exceptions/HttpException';

export class VisitasController {
  constructor(private readonly visitasRepository: VisitasRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Registrar entrada (login) */
  async createEntradaVisitas(
    req: Request<{}, {}, VisitasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id_visitantes } = req.body;

      if (!id_visitantes) {
        throw new HttpException(400, 'id_visitantes é obrigatório');
      }

      const visitaAberta =
        await this.visitasRepository.findVisitaAbertaByVisitantesId(
          id_visitantes
        );

      if (visitaAberta) {
        throw new HttpException(
          409,
          'Já existe uma visita aberta para este visitante.'
        );
      }

      const visitas = await this.visitasRepository.registerEntradaVisitas(
        req.body
      );

      return res.status(201).send({
        success: true,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Registrar saída (logoff) */
  async registrarSaidaVisitas(
    req: Request<{ visitasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitasId = Number(req.params.visitasId);

      if (Number.isNaN(visitasId) || visitasId <= 0) {
        throw new HttpException(400, 'ID da visita inválido');
      }

      const visitas = await this.visitasRepository.registerSaidaVisitas(
        visitasId
      );

      return res.status(200).send({
        success: true,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar visita por ID */
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

      const visitas =
        await this.visitasRepository.findOneVisitasById(visitasId);

      if (!visitas) {
        throw new HttpException(
          404,
          `Visita ID ${visitasId} não encontrada.`
        );
      }

      return res.status(200).send({
        success: true,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todas as visitas */
  async findAllVisitas(req: Request, res: Response, next: NextFunction) {
    try {
      const visitas = await this.visitasRepository.findVisitasAll(
        undefined,
        { createdAt: 'DESC' }
      );

      return res.status(200).send({
        success: true,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualização manual */
  async updateIdVisitas(
    req: Request<{ visitasId: string }, {}, VisitasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitasId = Number(req.params.visitasId);

      if (Number.isNaN(visitasId) || visitasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const visitas = await this.visitasRepository.updateVisitasId(
        visitasId,
        req.body
      );

      return res.status(200).send({
        success: true,
        visitas
      });
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

      return res.status(200).send({
        success: true,
        message: `Visita ID ${visitasId} removida com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchVisitasAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, id_visitantes, nome, fantasy } = req.query;

      const visitas = await this.visitasRepository.searchVisitas({
        id: id ? Number(id) : undefined,
        id_visitantes: id_visitantes
          ? Number(id_visitantes)
          : undefined,
        nome: nome ? String(nome) : undefined,
        fantasy: fantasy ? String(fantasy) : undefined
      });

      return res.status(200).send({
        success: true,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchVisitasNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;

      const visitas =
        await this.visitasRepository.searchNomeVisitas(text);

      return res.status(200).send({
        success: true,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado */
  async searchVisitasFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;

      const visitas =
        await this.visitasRepository.searchFantasyVisitas(text);

      return res.status(200).send({
        success: true,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Histórico por visitante */
  async findAllVisitasVisitante(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const visitas =
        await this.visitasRepository.findAllVisitasByVisitantesId(
          visitantesId
        );

      return res.status(200).send({
        success: true,
        total: visitas.length,
        visitas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Total de visitas do visitante */
  async countVisitasVisitante(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const total =
        await this.visitasRepository.countVisitasByVisitantesId(
          visitantesId
        );

      return res.status(200).send({
        success: true,
        total
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Soma do tempo de visitas */
  async sumTempoVisitasVisitante(
    req: Request<{ visitantesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const visitantesId = Number(req.params.visitantesId);

      if (Number.isNaN(visitantesId) || visitantesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const totalMinutos =
        await this.visitasRepository.sumTempoVisitasByVisitantesId(
          visitantesId
        );

      return res.status(200).send({
        success: true,
        totalMinutos
      });
    } catch (error) {
      next(error);
    }
  }
}