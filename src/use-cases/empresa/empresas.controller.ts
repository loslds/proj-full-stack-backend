
// C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.controller.ts
import { NextFunction, Request, Response } from 'express';
import { EmpresasRepository } from './empresas.repository';
import { EmpresasCreate, EmpresasUpdate } from './empresas.dto';
import { HttpException } from '../../exceptions/HttpException';

export class EmpresasController {
  constructor(private readonly empresasRepository: EmpresasRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar nova empresa */
  async createNewEmpresas(
    req: Request<{}, {}, EmpresasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, fantasy, id_pessoas } = req.body;

      if (!nome || !fantasy || !id_pessoas) {
        throw new HttpException(
          400,
          'Nome, fantasy e id_pessoas são obrigatórios'
        );
      }

      const empresas = await this.empresasRepository.createEmpresas(req.body);

      return res.status(201).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar empresa pelo ID */
  async updateIdEmpresas(
    req: Request<{ empresasId: string }, {}, EmpresasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const empresas = await this.empresasRepository.updateEmpresasId(
        empresasId,
        req.body
      );

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover empresa */
  async removeIdEmpresas(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.empresasRepository.deleteEmpresasId(empresasId);

      return res.status(200).send({
        success: true
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar empresa pelo ID */
  async getOneEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const empresas = await this.empresasRepository.findOneEmpresasById(
        empresasId
      );

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todas as empresas */
  async findAllEmpresas(req: Request, res: Response, next: NextFunction) {
    try {
      const empresas = await this.empresasRepository.findEmpresasAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome, fantasy e pessoa */
  async searchEmpresasAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy, id_pessoas } = req.query;

      const empresas = await this.empresasRepository.searchEmpresas({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        fantasy: fantasy !== undefined ? String(fantasy) : undefined,
        id_pessoas:
          id_pessoas !== undefined ? Number(id_pessoas) : undefined
      });

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchEmpresasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const empresas =
        await this.empresasRepository.searchNameParcialEmpresas(text);

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado */
  async searchEmpresasFantasy(req: Request, res: Response, next: NextFunction) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const empresas =
        await this.empresasRepository.searchFantasyParcialEmpresas(text);

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma empresa pelo nome exato */
  async findOneEmpresasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome =
        req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const empresas = await this.empresasRepository.findOneEmpresasByNome(
        nome
      );

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as empresas com nome exato */
  async findAllEmpresasNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nome =
        req.query.nome !== undefined ? String(req.query.nome) : undefined;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const empresas = await this.empresasRepository.findAllEmpresasByNome(
        nome
      );

      return res.status(200).send({
        success: true,
        total: empresas.length,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar uma empresa pelo fantasy exato */
  async findOneEmpresasFantasy(req: Request, res: Response, next: NextFunction) {
    try {
      const fantasy =
        req.query.fantasy !== undefined ? String(req.query.fantasy) : undefined;

      if (!fantasy) {
        throw new HttpException(400, "Parâmetro 'fantasy' é obrigatório");
      }

      const empresas = await this.empresasRepository.findOneEmpresasByFantasy(
        fantasy
      );

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as empresas com fantasy exato */
  async findAllEmpresasFantasy(req: Request, res: Response, next: NextFunction) {
    try {
      const fantasy =
        req.query.fantasy !== undefined ? String(req.query.fantasy) : undefined;

      if (!fantasy) {
        throw new HttpException(400, "Parâmetro 'fantasy' é obrigatório");
      }

      const empresas = await this.empresasRepository.findAllEmpresasByFantasy(
        fantasy
      );

      return res.status(200).send({
        success: true,
        total: empresas.length,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todas as empresas por pessoa */
  async findAllEmpresasPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const empresas =
        await this.empresasRepository.findAllEmpresasByPessoasId(pessoasId);

      return res.status(200).send({
        success: true,
        total: empresas.length,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista empresas com detalhes */
  async listAllEmpresasDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresas = await this.empresasRepository.listAllEmpresasDetails();

      return res.status(200).send({
        success: true,
        empresas
      });
    } catch (error) {
      next(error);
    }
  }
}