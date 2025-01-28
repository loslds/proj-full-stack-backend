
import type { NextFunction, Request, Response } from 'express';
import type { ConsumidoresRepository } from './consumidores.repository';
import { ConsumidoresCreate, ConsumidoresUpdate } from './consumidores.dto';

export class ConsumidoresController {  
  constructor(private readonly consumidoresRepository: ConsumidoresRepository) {}
  
  /** POST Cria um novo registro de Consumidores */
  async create(
    req: Request<{}, {}, ConsumidoresCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidor = await this.consumidoresRepository.createConsumidores(req.body);
      return res.status(201).send({ success: true, consumidor });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Consumidores */
  async update(
    req: Request<{ consumidoresId: string }, {}, Partial<ConsumidoresUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const consumidoresId = Number(req.params.consumidoresId);
    if (isNaN(consumidoresId) || consumidoresId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid consumidoresId' })
        .end();
    }
  
    try {
      const consumidores = await this.consumidoresRepository.updateConsumidores(consumidoresId, req.body);
      return res.status(200).send({ success: true, consumidores }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Consumidores */
  async remove(
    req: Request<{ consumidoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const consumidoresId = Number(req.params.consumidoresId);
    if (isNaN(consumidoresId) || consumidoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid consumidoresId' }).end();
    }

    try {
      const deleted = await this.consumidoresRepository.deleteConsumidores(consumidoresId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Consumidores */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const consumidores = await this.consumidoresRepository.findConsumidoresAll();
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Consumidor por ID */
  async getOne(
    req: Request<{ consumidoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const consumidoresId = Number(req.params.consumidoresId);

    if (isNaN(consumidoresId) || consumidoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid consumidoresId' }).end();
    }

    try {
      const consumidores = await this.consumidoresRepository.findConsumidoresById(consumidoresId);
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Consumidores por Nome */
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
      const consumidores = await this.consumidoresRepository.findConsumidoresByName(name);
      return res.status(200).send({ success: true, consumidores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Consumidores por Fantasia */
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
      const consumidores = await this.consumidoresRepository.findConsumidoresByFantasy(fantasy);
      return res.status(200).send({ success: true, consumidores }).end();
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
      const consumidores = await this.consumidoresRepository.findConsumidoresAllByPessoaId(pessoaId);
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
      const consumidores = await this.consumidoresRepository.findConsumidoresAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }
}

