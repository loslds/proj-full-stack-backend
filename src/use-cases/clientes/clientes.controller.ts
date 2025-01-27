
import type { NextFunction, Request, Response } from 'express';
import type { ClientesRepository } from './clientes.repository';
import { ClientesCreate, ClientesUpdate } from './clientes.dto';

export class ClientesController {  
  constructor(private readonly clientesRepository: ClientesRepository) {}
  
  /** POST Cria um novo registro de Clientes */
  async create(
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

  /** PATCH Atualiza um registro de Clientes */
  async update(
    req: Request<{ clientesId: string }, {}, Partial<ClientesUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const clientesId = Number(req.params.clientesId);
    if (isNaN(clientesId) || clientesId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid clientesId' })
        .end();
    }
  
    try {
      const clientes = await this.clientesRepository.updateClientes(clientesId, req.body);
      return res.status(200).send({ success: true, clientes }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Clientes */
  async remove(
    req: Request<{ clientesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const clientesId = Number(req.params.clientesId);
    if (isNaN(clientesId) || clientesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clienteIsd' }).end();
    }

    try {
      const deleted = await this.clientesRepository.deleteClientes(clientesId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Clientes */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const clientes = await this.clientesRepository.findClientesAll();
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Clientes por ID */
  async getOne(
    req: Request<{ clientesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const clientesId = Number(req.params.clientesId);

    if (isNaN(clientesId) || clientesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clientesId' }).end();
    }

    try {
      const clientes = await this.clientesRepository.findClientesById(clientesId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Cliente por Nome */
  async findByName(
    req: Request<{}, {}, {}, Partial<{ name: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: 'Name parameter is required' })
        .end();
    }

    try {
      const clientes = await this.clientesRepository.findClientesByName(name);
      return res.status(200).send({ success: true, clientes }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Clientes por Fantasia */
  async findByFantasy(
    req: Request<{}, {}, {}, Partial<{ fantasy: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { fantasy } = req.query;

    if (!fantasy) {
      return res
        .status(400).send({ success: false, message: 'Fantasy parameter is required' }).end();
    }

    try {
      const clientes = await this.clientesRepository.findClientesByFantasy(fantasy);
      return res.status(200).send({ success: true, clientes }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas as empresas pelo ID de Pessoa */
  async findAllByPessoaId(
    req: Request<{ pessoaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoaId = Number(req.params.pessoaId);
    if (isNaN(pessoaId) || pessoaId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoaId' }).end();
    }

    try {
      const clientes = await this.clientesRepository.findClientesAllPessoaId(pessoaId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas as empresas pelo ID de Pessoa */
  async findAllByEmpresaId(
    req: Request<{ empresaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresaId = Number(req.params.empresaId);
    if (isNaN(empresaId) || empresaId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresaId' }).end();
    }

    try {
      const clientes = await this.clientesRepository.findClientesAllEmpresaId(empresaId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
}

