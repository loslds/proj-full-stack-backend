
import type { NextFunction, Request, Response } from 'express';
import type { ClienteRepository } from './cliente.repository';
import { ClienteCreate, ClienteUpdate } from './cliente.dto';

export class ClienteController {  
  constructor(private readonly clienteRepository: ClienteRepository) {}
  
  /** POST Cria um novo registro de Cliente */
  async create(
    req: Request<{}, {}, ClienteCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cliente = await this.clienteRepository.createCliente(req.body);
      return res.status(201).send({ success: true, cliente });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Cliente */
  async update(
    req: Request<{ clienteId: string }, {}, Partial<ClienteUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const clienteId = Number(req.params.clienteId);
    if (isNaN(clienteId) || clienteId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid clienteId' })
        .end();
    }
  
    try {
      const cliente = await this.clienteRepository.updateCliente(clienteId, req.body);
      return res.status(200).send({ success: true, cliente }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Cliente */
  async remove(
    req: Request<{ clienteId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const clienteId = Number(req.params.clienteId);
    if (isNaN(clienteId) || clienteId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clienteId' }).end();
    }

    try {
      const deleted = await this.clienteRepository.deleteCliente(clienteId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Cliente */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const clientes = await this.clienteRepository.findClienteAll();
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Cliente por ID */
  async getOne(
    req: Request<{ clienteId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const clienteId = Number(req.params.clienteId);

    if (isNaN(clienteId) || clienteId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clienteId' }).end();
    }

    try {
      const cliente = await this.clienteRepository.findClienteById(clienteId);
      return res.status(200).send({ success: true, cliente });
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
      const cliente = await this.clienteRepository.findClienteByName(name);
      return res.status(200).send({ success: true, cliente }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Cliente por Fantasia */
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
      const cliente = await this.clienteRepository.findClienteByFantasy(fantasy);
      return res.status(200).send({ success: true, cliente }).end();
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
      const clientes = await this.clienteRepository.findClientesAllByPessoaId(pessoaId);
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
      const clientes = await this.clienteRepository.findClientesAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
}

