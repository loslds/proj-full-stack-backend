
//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.controller.ts

import { Request, Response, NextFunction } from 'express';
import { FuncionariosRepository } from './funcionarios.repository';
import { FuncionariosCreate, FuncionariosUpdate } from './funcionarios.dto';
import { HttpException } from '../../exceptions/HttpException';

export class FuncionariosController {
  constructor(private readonly funcionariosRepository: FuncionariosRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todos os funcionários */
  async findAllFuncionarios(req: Request, res: Response, next: NextFunction) {
    try {
      const funcionarios =
        await this.funcionariosRepository.findFuncionariosAll(undefined, {
          nome: 'ASC'
        });

      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada por id, nome, fantasy, pessoa e empresa */
  async searchFuncionariosAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy, id_pessoas, id_empresas } = req.query;

      const funcionarios = await this.funcionariosRepository.searchFuncionarios({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined,
        fantasy: fantasy ? String(fantasy) : undefined,
        id_pessoas: id_pessoas ? Number(id_pessoas) : undefined,
        id_empresas: id_empresas ? Number(id_empresas) : undefined
      });

      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchFuncionariosNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const funcionarios =
        await this.funcionariosRepository.searchNameParcialFuncionarios(text);

      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado */
  async searchFuncionariosFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const funcionarios =
        await this.funcionariosRepository.searchFantasyParcialFuncionarios(text);

      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um funcionário pelo nome exato */
  async findOneFuncionariosNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const funcionarios =
        await this.funcionariosRepository.findOneFuncionariosByNome(nome);

      return res.status(200).send({
        success: true,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os funcionários com nome exato */
  async findAllFuncionariosNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const funcionarios =
        await this.funcionariosRepository.findAllFuncionariosByNome(nome);

      return res.status(200).send({
        success: true,
        total: funcionarios.length,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um funcionário pelo fantasy exato */
  async findOneFuncionariosFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fantasy = req.query?.fantasy as string;

      if (!fantasy) {
        throw new HttpException(400, "Parâmetro 'fantasy' é obrigatório");
      }

      const funcionarios =
        await this.funcionariosRepository.findOneFuncionariosByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os funcionários com fantasy exato */
  async findAllFuncionariosFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fantasy = req.query?.fantasy as string;

      if (!fantasy) {
        throw new HttpException(400, "Parâmetro 'fantasy' é obrigatório");
      }

      const funcionarios =
        await this.funcionariosRepository.findAllFuncionariosByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        total: funcionarios.length,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os funcionários por id_pessoas */
  async findAllFuncionariosPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (!pessoasId || Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const funcionarios =
        await this.funcionariosRepository.findAllFuncionariosByPessoasId(pessoasId);

      return res.status(200).send({
        success: true,
        total: funcionarios.length,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os funcionários por id_empresas */
  async findAllFuncionariosEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (!empresasId || Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const funcionarios =
        await this.funcionariosRepository.findAllFuncionariosByEmpresasId(empresasId);

      return res.status(200).send({
        success: true,
        total: funcionarios.length,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista detalhada com pessoas + empresas */
  async listAllFuncionariosDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionarios =
        await this.funcionariosRepository.listAllFuncionariosDetails();

      return res.status(200).send({
        success: true,
        total: funcionarios.length,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar novo funcionário */
  async createNewFuncionarios(
    req: Request<{}, {}, FuncionariosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, fantasy } = req.body;

      if (!nome || !fantasy) {
        throw new HttpException(400, 'Nome e fantasy são obrigatórios');
      }

      const funcionarios =
        await this.funcionariosRepository.createFuncionarios(req.body);

      return res.status(201).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar funcionário pelo ID */
  async updateIdFuncionarios(
    req: Request<{ funcionariosId: string }, {}, FuncionariosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionariosId = Number(req.params.funcionariosId);

      if (!funcionariosId || Number.isNaN(funcionariosId) || funcionariosId <= 0) {
        throw new HttpException(400, 'ID do funcionário inválido');
      }

      const funcionarios = await this.funcionariosRepository.updateFuncionariosId(
        funcionariosId,
        req.body
      );

      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover funcionário */
  async removeIdFuncionarios(
    req: Request<{ funcionariosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionariosId = Number(req.params.funcionariosId);

      if (Number.isNaN(funcionariosId) || funcionariosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.funcionariosRepository.deleteFuncionariosId(funcionariosId);

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar funcionário pelo ID */
  async getOneFuncionariosId(
    req: Request<{ funcionariosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionariosId = Number(req.params.funcionariosId);

      if (Number.isNaN(funcionariosId) || funcionariosId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const funcionarios =
        await this.funcionariosRepository.findOneFuncionariosById(funcionariosId);

      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }
}

