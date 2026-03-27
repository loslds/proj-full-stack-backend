
// C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\fornecedores.controller.ts

import { NextFunction, Request, Response } from 'express';
import { FornecedoresRepository } from './fornecedores.repository';
import { FornecedoresCreate, FornecedoresUpdate } from './fornecedores.dto'
import { HttpException } from '../../exceptions/HttpException';

export class FornecedoresController {
  constructor(private readonly fornecedoresRepository: FornecedoresRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo consumidor */
  async createNewFornecedores(
    req: Request<{}, {}, FornecedoresCreate>,
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

      const duplicated = await this.fornecedoresRepository.hasDuplicated(
        nome,
        fantasy,
        id_pessoas,
        id_empresas
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe fornecedores com os dados informados.'
        );
      }

      const fornecedores = await this.fornecedoresRepository.createFornecedores(
        req.body
      );

      return res.status(201).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar fornecedores pelo ID */
  async updateIdFornecedores(
    req: Request<{ fornecedoresId: string }, {}, FornecedoresUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedoresId = Number(req.params.fornecedoresId);

      if (Number.isNaN(fornecedoresId) || fornecedoresId <= 0) {
        throw new HttpException(400, 'ID do fornecedor inválido');
      }

      const payload = req.body;

      const duplicated = await this.fornecedoresRepository.hasDuplicated(
        payload.nome,
        payload.fantasy,
        payload.id_pessoas,
        payload.id_empresas,
        [fornecedoresId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe fornecedores com os dados informados.'
        );
      }

      const fornecedores =
        await this.fornecedoresRepository.updateFornecedoresId(
          fornecedoresId,
          payload
        );

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover consumidor */
  async removeIdFornecedores(
    req: Request<{ fornecedoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedoresId = Number(req.params.fornecedoresId);

      if (Number.isNaN(fornecedoresId) || fornecedoresId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.fornecedoresRepository.deleteFornecedoresId(fornecedoresId);

      return res.status(200).send({
        success: true,
        message: `Fornecedor ID ${fornecedoresId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar fornecedor pelo ID */
  async getOneFornecedoresId(
    req: Request<{ fornecedoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedoresId = Number(req.params.fornecedoresId);

      if (Number.isNaN(fornecedoresId) || fornecedoresId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const fornecedores =
        await this.fornecedoresRepository.findOneFornecedoresById(
          fornecedoresId
        );

      if (!fornecedores) {
        throw new HttpException(
          404,
          `Fornecedor ID ${fornecedoresId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os fornecedores */
  async findAllFornecedores(req: Request, res: Response, next: NextFunction) {
    try {
      const fornecedores = await this.fornecedoresRepository.findFornecedoresAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome, fantasy, pessoa e empresa */
  async searchFornecedoresAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, nome, fantasy, id_pessoas, id_empresas } = req.query;

      const fornecedores = await this.fornecedoresRepository.searchFornecedores({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        fantasy: fantasy !== undefined ? String(fantasy) : undefined,
        id_pessoas: id_pessoas !== undefined ? Number(id_pessoas) : undefined,
        id_empresas: id_empresas !== undefined ? Number(id_empresas) : undefined
      });

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchFornecedoresNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const fornecedores =
        await this.fornecedoresRepository.searchNameParcialFornecedores(text);

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado */
  async searchFornecedoresFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const fornecedores =
        await this.fornecedoresRepository.searchFantasyParcialFornecedores(text);

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um fornecedores pelo nome exato */
  async findOneFornecedoresNome(
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

      const fornecedores =
        await this.fornecedoresRepository.findOneFornecedoresByNome(nome);

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os fornecedores com nome exato */
  async findAllFornecedoresNome(
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

      const fornecedores =
        await this.fornecedoresRepository.findAllFornecedoresByNome(nome);

      return res.status(200).send({
        success: true,
        total: fornecedores.length,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um fornecedores pelo fantasy exato */
  async findOneFornecedoresFantasy(
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

      const fornecedores =
        await this.fornecedoresRepository.findOneFornecedoresByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os fornecedores com fantasy exato */
  async findAllFornecedoresFantasy(
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

      const fornecedores =
        await this.fornecedoresRepository.findAllFornecedoresByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        total: fornecedores.length,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os fornecedores por pessoa */
  async findAllFornecedoresPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const fornecedores =
        await this.fornecedoresRepository.findAllFornecedoresByPessoasId(
          pessoasId
        );

      return res.status(200).send({
        success: true,
        total: fornecedores.length,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os fornecedores por empresa */
  async findAllFornecedoresEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const fornecedores =
        await this.fornecedoresRepository.findAllFornecedoresByEmpresasId(
          empresasId
        );

      return res.status(200).send({
        success: true,
        total: fornecedores.length,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista fornecedores com detalhes */
  async listAllFornecedoresDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedores =
        await this.fornecedoresRepository.listAllFornecedoresDetails();

      return res.status(200).send({
        success: true,
        fornecedores
      });
    } catch (error) {
      next(error);
    }
  }
}