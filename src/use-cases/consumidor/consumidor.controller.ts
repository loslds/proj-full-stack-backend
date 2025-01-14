
import type { NextFunction, Request, Response } from 'express';
import type { ConsumidorRepository } from './consumidor.repository';
import { ConsumidorCreate, ConsumidorUpdate } from './consumidor.dto';

export class ConsumidorController {  
  constructor(private readonly consumidorRepository: ConsumidorRepository) {}
  
  /** POST Cria um novo registro de Consumidor */
  async create(
    req: Request<{}, {}, ConsumidorCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidor = await this.consumidorRepository.createConsumidor(req.body);
      return res.status(201).send({ success: true, consumidor });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Consumidor */
  async update(
    req: Request<{ consumidorId: string }, {}, Partial<ConsumidorUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const consumidorId = Number(req.params.consumidorId);
    if (isNaN(consumidorId) || consumidorId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid consumidorId' })
        .end();
    }
  
    try {
      const consumidor = await this.consumidorRepository.updateConsumidor(consumidorId, req.body);
      return res.status(200).send({ success: true, consumidor }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Consumidor */
  async remove(
    req: Request<{ consumidorId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const consumidorId = Number(req.params.consumidorId);
    if (isNaN(consumidorId) || consumidorId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid consumidorId' }).end();
    }

    try {
      const deleted = await this.consumidorRepository.deleteConsumidor(consumidorId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Consumidor */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const consumidores = await this.consumidorRepository.findConsumidorAll();
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Consumidor por ID */
  async getOne(
    req: Request<{ consumidorId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const consumidorId = Number(req.params.consumidorId);

    if (isNaN(consumidorId) || consumidorId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid consumidorId' }).end();
    }

    try {
      const consumidor = await this.consumidorRepository.findConsumidorById(consumidorId);
      return res.status(200).send({ success: true, consumidor });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Consumidor por Nome */
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
      const consumidor = await this.consumidorRepository.findConsumidorByName(name);
      return res.status(200).send({ success: true, consumidor }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Consumidor por Fantasia */
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
      const consumidor = await this.consumidorRepository.findConsumidorByFantasy(fantasy);
      return res.status(200).send({ success: true, consumidor }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas as Consumidor pelo ID de Pessoa */
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
      const consumidores = await this.consumidorRepository.findConsumidorAllByPessoaId(pessoaId);
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas as Consumidor pelo ID de Empresa */
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
      const consumidores = await this.consumidorRepository.findConsumidorAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }
}

