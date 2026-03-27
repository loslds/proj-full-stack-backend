
//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.controller.ts
// C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.controller.ts
import { NextFunction, Request, Response } from 'express';
import { FuncionariosRepository } from './funcionarios.repository';
import { FuncionariosCreate, FuncionariosUpdate } from './funcionarios.dto';
import { HttpException } from '../../exceptions/HttpException';

export class FuncionariosController {
  constructor(private readonly funcionariosRepository: FuncionariosRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo funcionário */
  async createNewFuncionarios(
    req: Request<{}, {}, FuncionariosCreate>,
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

      const duplicated = await this.funcionariosRepository.hasDuplicated(
        nome,
        fantasy,
        id_pessoas,
        id_empresas
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe funcionário com os dados informados.'
        );
      }

      const funcionarios = await this.funcionariosRepository.createFuncionarios(
        req.body
      );

      return res.status(201).send({
        success: true,
        funcionarios
      });
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

      if (Number.isNaN(funcionariosId) || funcionariosId <= 0) {
        throw new HttpException(400, 'ID do funcionário inválido');
      }

      const payload = req.body;

      const duplicated = await this.funcionariosRepository.hasDuplicated(
        payload.nome,
        payload.fantasy,
        payload.id_pessoas,
        payload.id_empresas,
        [funcionariosId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe funcionário com os dados informados.'
        );
      }

      const funcionarios =
        await this.funcionariosRepository.updateFuncionariosId(
          funcionariosId,
          payload
        );

      return res.status(200).send({
        success: true,
        funcionarios
      });
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

      return res.status(200).send({
        success: true,
        message: `Funcionário ID ${funcionariosId} removido com sucesso.`
      });
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
        await this.funcionariosRepository.findOneFuncionariosById(
          funcionariosId
        );

      if (!funcionarios) {
        throw new HttpException(
          404,
          `Funcionário ID ${funcionariosId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os funcionários */
  async findAllFuncionarios(req: Request, res: Response, next: NextFunction) {
    try {
      const funcionarios = await this.funcionariosRepository.findFuncionariosAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome, fantasy, pessoa e empresa */
  async searchFuncionariosAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, nome, fantasy, id_pessoas, id_empresas } = req.query;

      const funcionarios = await this.funcionariosRepository.searchFuncionarios({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        fantasy: fantasy !== undefined ? String(fantasy) : undefined,
        id_pessoas: id_pessoas !== undefined ? Number(id_pessoas) : undefined,
        id_empresas: id_empresas !== undefined ? Number(id_empresas) : undefined
      });

      return res.status(200).send({
        success: true,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchFuncionariosNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const funcionarios =
        await this.funcionariosRepository.searchNameParcialFuncionarios(text);

      return res.status(200).send({
        success: true,
        funcionarios
      });
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
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const funcionarios =
        await this.funcionariosRepository.searchFantasyParcialFuncionarios(text);

      return res.status(200).send({
        success: true,
        funcionarios
      });
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
      const nome =
        req.query.nome !== undefined ? String(req.query.nome) : undefined;

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
      const nome =
        req.query.nome !== undefined ? String(req.query.nome) : undefined;

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
      const fantasy =
        req.query.fantasy !== undefined ? String(req.query.fantasy) : undefined;

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
      const fantasy =
        req.query.fantasy !== undefined ? String(req.query.fantasy) : undefined;

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

  /** GET → Buscar todos os funcionários por pessoa */
  async findAllFuncionariosPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const funcionarios =
        await this.funcionariosRepository.findAllFuncionariosByPessoasId(
          pessoasId
        );

      return res.status(200).send({
        success: true,
        total: funcionarios.length,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os funcionários por empresa */
  async findAllFuncionariosEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const funcionarios =
        await this.funcionariosRepository.findAllFuncionariosByEmpresasId(
          empresasId
        );

      return res.status(200).send({
        success: true,
        total: funcionarios.length,
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista funcionários com detalhes */
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
        funcionarios
      });
    } catch (error) {
      next(error);
    }
  }
}