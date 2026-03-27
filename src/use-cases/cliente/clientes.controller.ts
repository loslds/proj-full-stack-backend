
// C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.controller.ts

import { NextFunction, Request, Response } from 'express';
import { ClientesRepository } from './clientes.repository';
import { ClientesCreate, ClientesUpdate } from './clientes.dto';
import { HttpException } from '../../exceptions/HttpException';

export class ClientesController {
  constructor(private readonly clientesRepository: ClientesRepository) {}

  // ============================================================
  // * CRUD *
  // ============================================================

  /** POST → Criar novo consumidor */
  async createNewClientes(
    req: Request<{}, {}, ClientesCreate>,
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

      const duplicated = await this.clientesRepository.hasDuplicated(
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

      const clientes = await this.clientesRepository.createClientes(
        req.body
      );

      return res.status(201).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar consumidor pelo ID */
  async updateIdClientes(
    req: Request<{ clientesId: string }, {}, ClientesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientesId = Number(req.params.clientesId);

      if (Number.isNaN(clientesId) || clientesId <= 0) {
        throw new HttpException(400, 'ID do consumidor inválido');
      }

      const payload = req.body;

      const duplicated = await this.clientesRepository.hasDuplicated(
        payload.nome,
        payload.fantasy,
        payload.id_pessoas,
        payload.id_empresas,
        [clientesId]
      );

      if (duplicated) {
        throw new HttpException(
          409,
          'Já existe consumidor com os dados informados.'
        );
      }

      const clientes =
        await this.clientesRepository.updateClientesId(
          clientesId,
          payload
        );

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover consumidor */
  async removeIdClientes(
    req: Request<{ clientesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientesId = Number(req.params.clientesId);

      if (Number.isNaN(clientesId) || clientesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      await this.clientesRepository.deleteClientesId(clientesId);

      return res.status(200).send({
        success: true,
        message: `Consumidor ID ${clientesId} removido com sucesso.`
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar consumidor pelo ID */
  async getOneClientesId(
    req: Request<{ clientesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientesId = Number(req.params.clientesId);

      if (Number.isNaN(clientesId) || clientesId <= 0) {
        throw new HttpException(400, 'ID inválido');
      }

      const clientes =
        await this.clientesRepository.findOneClientesById(
          clientesId
        );

      if (!clientes) {
        throw new HttpException(
          404,
          `Consumidor ID ${clientesId} não encontrado.`
        );
      }

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista todos os clientes */
  async findAllClientes(req: Request, res: Response, next: NextFunction) {
    try {
      const clientes = await this.clientesRepository.findClientesAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  /** GET → Pesquisa combinada por id, nome, fantasy, pessoa e empresa */
  async searchClientesAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, nome, fantasy, id_pessoas, id_empresas } = req.query;

      const clientes = await this.clientesRepository.searchClientes({
        id: id !== undefined ? Number(id) : undefined,
        nome: nome !== undefined ? String(nome) : undefined,
        fantasy: fantasy !== undefined ? String(fantasy) : undefined,
        id_pessoas: id_pessoas !== undefined ? Number(id_pessoas) : undefined,
        id_empresas: id_empresas !== undefined ? Number(id_empresas) : undefined
      });

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchClientesNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const clientes =
        await this.clientesRepository.searchNameParcialClientes(text);

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por fantasy aproximado */
  async searchClientesFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text =
        req.query.text !== undefined ? String(req.query.text) : undefined;

      const clientes =
        await this.clientesRepository.searchFantasyParcialClientes(text);

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um consumidor pelo nome exato */
  async findOneClientesNome(
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

      const clientes =
        await this.clientesRepository.findOneClientesByNome(nome);

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os clientes com nome exato */
  async findAllClientesNome(
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

      const clientes =
        await this.clientesRepository.findAllClientesByNome(nome);

      return res.status(200).send({
        success: true,
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um consumidor pelo fantasy exato */
  async findOneClientesFantasy(
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

      const clientes =
        await this.clientesRepository.findOneClientesByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os clientes com fantasy exato */
  async findAllClientesFantasy(
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

      const clientes =
        await this.clientesRepository.findAllClientesByFantasy(fantasy);

      return res.status(200).send({
        success: true,
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os clientes por pessoa */
  async findAllClientesPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const clientes =
        await this.clientesRepository.findAllClientesByPessoasId(
          pessoasId
        );

      return res.status(200).send({
        success: true,
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os clientes por empresa */
  async findAllClientesEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const clientes =
        await this.clientesRepository.findAllClientesByEmpresasId(
          empresasId
        );

      return res.status(200).send({
        success: true,
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista clientes com detalhes */
  async listAllClientesDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientes =
        await this.clientesRepository.listAllClientesDetails();

      return res.status(200).send({
        success: true,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }
}