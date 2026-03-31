

// C:\repository\proj-full-stack-backend\src\use-cases\fone\fones.controller.ts
import { NextFunction, Request, Response } from 'express';
import { FonesRepository } from './fones.repository';
import { FonesCreate, FonesUpdate } from './fones.dto';
import { HttpException } from '../../exceptions/HttpException';

export class FonesController {
  constructor(private readonly fonesRepository: FonesRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo telefone */
  async createNewFones(
    req: Request<{}, {}, FonesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id_cadastros } = req.body;

      if (!id_cadastros) {
        throw new HttpException(400, 'id_cadastros é obrigatório');
      }

      const fones = await this.fonesRepository.createFones(req.body);

      return res.status(201).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar telefone */
  async updateIdFones(
    req: Request<{ fonesId: string }, {}, FonesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fonesId = Number(req.params.fonesId);

      if (Number.isNaN(fonesId) || fonesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const fones = await this.fonesRepository.updateFonesId(
        fonesId,
        req.body
      );

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover telefone */
  async removeIdFones(
    req: Request<{ fonesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fonesId = Number(req.params.fonesId);

      if (Number.isNaN(fonesId) || fonesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.fonesRepository.deleteFonesId(fonesId);

      return res.status(200).send({
        success: true,
        message: `Telefone ID ${fonesId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar por ID */
  async getOneFonesId(
    req: Request<{ fonesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fonesId = Number(req.params.fonesId);

      if (Number.isNaN(fonesId) || fonesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const fones = await this.fonesRepository.findOneFonesById(fonesId);

      if (!fones) {
        throw new HttpException(404, `Telefone ID ${fonesId} não encontrado.`);
      }

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos */
  async findAllFones(req: Request, res: Response, next: NextFunction) {
    try {
      const fones = await this.fonesRepository.findFonesAll(
        undefined,
        { id: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS *
  // ============================================================

  /** GET → Pesquisa combinada */
  async searchFonesAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        id,
        id_cadastros,
        fone_fixo,
        fone_celular,
        fone_contacto
      } = req.query;

      const fones = await this.fonesRepository.searchFones({
        id: id !== undefined ? Number(id) : undefined,
        id_cadastros:
          id_cadastros !== undefined ? Number(id_cadastros) : undefined,
        fone_fixo: fone_fixo !== undefined ? String(fone_fixo) : undefined,
        fone_celular:
          fone_celular !== undefined ? String(fone_celular) : undefined,
        fone_contacto:
          fone_contacto !== undefined ? String(fone_contacto) : undefined
      });

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca parcial */
  async searchFonesParcial(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const fones = await this.fonesRepository.searchFonesParcial(text);

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Fone fixo exato */
  async findOneFonesFixo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fone_fixo =
        req.query.fone_fixo !== undefined
          ? String(req.query.fone_fixo)
          : undefined;

      if (!fone_fixo) {
        throw new HttpException(400, "Parâmetro 'fone_fixo' é obrigatório");
      }

      const fones = await this.fonesRepository.findOneFonesFixo(fone_fixo);

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Todos fones fixos exatos */
  async findAllFonesFixo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fone_fixo =
        req.query.fone_fixo !== undefined
          ? String(req.query.fone_fixo)
          : undefined;

      if (!fone_fixo) {
        throw new HttpException(400, "Parâmetro 'fone_fixo' é obrigatório");
      }

      const fones = await this.fonesRepository.findAllFonesFixo(fone_fixo);

      return res.status(200).send({
        success: true,
        total: fones.length,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Fone celular exato */
  async findOneFonesCelular(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fone_celular =
        req.query.fone_celular !== undefined
          ? String(req.query.fone_celular)
          : undefined;

      if (!fone_celular) {
        throw new HttpException(400, "Parâmetro 'fone_celular' é obrigatório");
      }

      const fones =
        await this.fonesRepository.findOneFonesCelular(fone_celular);

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Todos fones celular exatos */
  async findAllFonesCelular(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fone_celular =
        req.query.fone_celular !== undefined
          ? String(req.query.fone_celular)
          : undefined;

      if (!fone_celular) {
        throw new HttpException(400, "Parâmetro 'fone_celular' é obrigatório");
      }

      const fones =
        await this.fonesRepository.findAllFonesCelular(fone_celular);

      return res.status(200).send({
        success: true,
        total: fones.length,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Fone contacto exato */
  async findOneFonesContacto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fone_contacto =
        req.query.fone_contacto !== undefined
          ? String(req.query.fone_contacto)
          : undefined;

      if (!fone_contacto) {
        throw new HttpException(400, "Parâmetro 'fone_contacto' é obrigatório");
      }

      const fones =
        await this.fonesRepository.findOneFonesContacto(fone_contacto);

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Todos fones contacto exatos */
  async findAllFonesContacto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fone_contacto =
        req.query.fone_contacto !== undefined
          ? String(req.query.fone_contacto)
          : undefined;

      if (!fone_contacto) {
        throw new HttpException(400, "Parâmetro 'fone_contacto' é obrigatório");
      }

      const fones =
        await this.fonesRepository.findAllFonesContacto(fone_contacto);

      return res.status(200).send({
        success: true,
        total: fones.length,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Por cadastro */
  async findAllFonesCadastrosId(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);

      if (Number.isNaN(cadastrosId) || cadastrosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const fones =
        await this.fonesRepository.findAllFonesByCadastrosId(cadastrosId);

      return res.status(200).send({
        success: true,
        total: fones.length,
        fones
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Details */
  async listAllFonesDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fones = await this.fonesRepository.listAllFonesDetails();

      return res.status(200).send({
        success: true,
        fones
      });
    } catch (error) {
      next(error);
    }
  }
}
