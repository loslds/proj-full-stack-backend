  
// C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ClientesRepository } from './clientes.repository';
import { ClientesCreate, ClientesUpdate } from './clientes.dto';
import { HttpException } from '../../exceptions/HttpException';

export class ClientesController {
  constructor(private readonly clientesRepository: ClientesRepository) {}

  // =========================================================================
  // LISTAGENS E PESQUISAS
  // =========================================================================

  /** GET → Lista todos os clientes */
  async findAllClientes(req: Request, res: Response, next: NextFunction) {
    try {
      const clientes = await this.clientesRepository.findClientesAll(
        undefined,
        { nome: 'ASC' }
      );

      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Pesquisa combinada por id, nome, fantasy, pessoa e empresa */
  async searchClientesAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy, id_pessoas, id_empresas } = req.query;

      const clientes = await this.clientesRepository.searchClientes({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined,
        fantasy: fantasy ? String(fantasy) : undefined,
        id_pessoas: id_pessoas ? Number(id_pessoas) : undefined,
        id_empresas: id_empresas ? Number(id_empresas) : undefined
      });

      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Busca por nome aproximado */
  async searchClientesNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const clientes =
        await this.clientesRepository.searchNameParcialClientes(text);

      return res.status(200).send({ success: true, clientes });
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
      const text = req.query.text ? String(req.query.text) : undefined;
      const clientes =
        await this.clientesRepository.searchFantasyParcialClientes(text);

      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um cliente pelo nome exato */
  async findOneClientesNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const clientes = await this.clientesRepository.findOneClientesByNome(nome);

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
      const nome = req.query?.nome as string;

      if (!nome) {
        throw new HttpException(400, "Parâmetro 'nome' é obrigatório");
      }

      const clientes = await this.clientesRepository.findAllClientesByNome(nome);

      return res.status(200).send({
        success: true,
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar um cliente pelo fantasy exato */
  async findOneClientesFantasy(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fantasy = req.query?.fantasy as string;

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
      const fantasy = req.query?.fantasy as string;

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

  /** GET → Buscar todos os clientes por id_pessoas */
  async findAllClientesPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoasId = Number(req.params.pessoasId);

      if (!pessoasId || Number.isNaN(pessoasId) || pessoasId <= 0) {
        throw new HttpException(400, 'ID da pessoa inválido');
      }

      const clientes =
        await this.clientesRepository.findAllClientesByPessoasId(pessoasId);

      return res.status(200).send({
        success: true,
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar todos os clientes por id_empresas */
  async findAllClientesEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresasId = Number(req.params.empresasId);

      if (!empresasId || Number.isNaN(empresasId) || empresasId <= 0) {
        throw new HttpException(400, 'ID da empresa inválido');
      }

      const clientes =
        await this.clientesRepository.findAllClientesByEmpresasId(empresasId);

      return res.status(200).send({
        success: true,
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Lista detalhada com pessoas + empresas */
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
        total: clientes.length,
        clientes
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================================
  // CRUD
  // =========================================================================

  /** POST → Criar novo cliente */
  async createNewClientes(
    req: Request<{}, {}, ClientesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, fantasy } = req.body;

      if (!nome || !fantasy) {
        throw new HttpException(400, 'Nome e fantasy são obrigatórios');
      }

      const clientes = await this.clientesRepository.createClientes(req.body);

      return res.status(201).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH → Atualizar cliente pelo ID */
  async updateIdClientes(
    req: Request<{ clientesId: string }, {}, ClientesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientesId = Number(req.params.clientesId);

      if (!clientesId || Number.isNaN(clientesId) || clientesId <= 0) {
        throw new HttpException(400, 'ID do cliente inválido');
      }

      const clientes = await this.clientesRepository.updateClientesId(
        clientesId,
        req.body
      );

      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE → Remover cliente */
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

      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET → Buscar cliente pelo ID */
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
        await this.clientesRepository.findOneClientesById(clientesId);

      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
}



