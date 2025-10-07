//

import { NextFunction, Request, Response } from "express";
import { ClientesRepository } from "./clientes.repository";
import { ClientesCreate, ClientesUpdate } from './clientes.dto';
import { ClientesEntity } from "./clientes.entity";
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type ClientesDto = DeepPartial<ClientesEntity>;
import { HttpException } from "../../middlewares/HttpException";
import { ParsedQs } from 'qs';

// Tipagem para query string da rota /search
interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}

export class ClientesController {  
  constructor(private readonly clientesRepository: ClientesRepository) {}

  /** 1 POST Cria Tabela consumidores */
  async createNewClientes(
    req: Request<{}, {}, ClientesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientes = await this.clientesRepository.createClientes(req.body);
      return res.status(201).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** 2 PATCH Atualiza um registro  */
  async updateIdClientes(
    req: Request<{ clientesId: string }, {}, Partial<ClientesUpdate>>,
    res: Response,
    next: NextFunction
    ) {
    const clientesId = Number(req.params.clientesId);
    if (isNaN(clientesId) || clientesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clientesId' }).end();
      }
    try {
      const clientes = await this.clientesRepository.updateClientesId(clientesId, req.body);
        return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** 3 DELETE Remove um registro  */
  async removeIdClientes(
    req: Request<{ clientesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const clientesId = Number(req.params.clientesId);
    if (isNaN(clientesId) || clientesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clientesId' }).end();
    }
    try {
      const success = await this.clientesRepository.deleteClientesId(clientesId);
      return res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  }

  
  /** 4 GET Busca todos os registros */
  async findAllClientes(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<ClientesEntity> | undefined;
  
      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<ClientesEntity>;
      }
  
      const clientes = await this.clientesRepository.findClientesAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, clientes });
  
    } catch (error) {
        next(error);
    }    
  }
  
  /** 5 GET Busca um registro por ID */
  async getOneClientesId(
    req: Request<{ clientesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const clientesId = Number(req.params.clientesId);
    if (isNaN(clientesId) || clientesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clientesId' }).end();
    }
    try {
      const clientes = await this.clientesRepository.findOneClientesById(clientesId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
  
  /** 6 GET Busca um registro por Nome */
  async findOneClientesNome(
    req: Request<{}, {}, {}, Partial<{ nome: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nome } = req.query;
    if (!nome) {
      return res.status(400).send({ success: false, message: 'Nome parameter is required' }).end();
    }
    try {
      const clientes = await this.clientesRepository.findOneClientesByNome(nome);
      return res.status(200).send({ success: true, clientes }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 7 GET Busca um registro por Fantasia  */
  async findOneClientesFantasy(
    req: Request<{}, {}, {}, Partial<{ fantasy: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { fantasy } = req.query;
    if (!fantasy) {
      return res.status(400).send({ success: false, message: 'Fantasy parameter is required' }).end();
    }
    try {
      const clientes = await this.clientesRepository.findOneClientesByFantasy(fantasy);
      return res.status(200).send({ success: true, clientes }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 8 pesquisa registro de Empresas através do ID ou NOME ou FANTASY */
  async searchByClientes(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy } = req.query;
      const results = await this.clientesRepository.searchClientes({
        id: id ? Number(id) : undefined,
        nome,
        fantasy,
      });
      return res.json(results);
    } catch (error) {
      next(error);
    }
  }

  /** 9 GET todos os reg. com id_pessoas */
  async findAllClientesPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoasId = Number(req.params.pessoasId);
    if (isNaN(pessoasId) || pessoasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoasId' }).end();
    }

    try {
      const clientes = await this.clientesRepository.findAllClientesByPessoasId(pessoasId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
  
  /** 10 GET todos os reg, mesmo ID de imagens */
  async findAllClientesImagensId(
    req: Request<{ imagensId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const imagensId = Number(req.params.imagensId);
    if (isNaN(imagensId) || imagensId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid imagensId' }).end();
    }

    try {
      const clientes = await this.clientesRepository.findAllClientesByImagensId(imagensId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

    /** 11 Lista todas empresas com todos os detalhes */
  async findAllClientesByDetails(req: Request, res: Response) {

    try {
      const clientes = await this.clientesRepository.listAllClientesDetails();
      res.json({ success: true, data: clientes });
      
    } catch (err: any) {
      console.error('Erro ao listar clientes:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
