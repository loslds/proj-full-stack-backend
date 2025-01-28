
import type { NextFunction, Request, Response } from 'express';

import type { FornecedoresRepository } from './fornecedores.repository';
import { FornecedoresCreate, FornecedoresUpdate } from './fornecedores.dto';

export class FornecedoresController {
  constructor(private readonly fornecedoresRepository: FornecedoresRepository) {}
  
  /** POST Cria um novo registro de Fornecedores */
  async create(
    req: Request<{}, {}, FornecedoresCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedores = await this.fornecedoresRepository.createFornecedores(req.body);
      return res.status(201).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Fornecedores */
  async update(
    req: Request<{ fornecedoresId: string }, {}, Partial<FornecedoresUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedoresId = Number(req.params.fornecedoresId);
    if (isNaN(fornecedoresId) || fornecedoresId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid fornecedoresId' })
        .end();
    }
  
    try {
      const fornecedores = await this.fornecedoresRepository.updateFornecedores(fornecedoresId, req.body);
      return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Fornecedores */
  async remove(
    req: Request<{ fornecedoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedoresId = Number(req.params.fornecedoresId);
    if (isNaN(fornecedoresId) || fornecedoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid fornecedoresId' }).end();
    }

    try {
      const deleted = await this.fornecedoresRepository.deleteFornecedores(fornecedoresId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Fornecedor */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const fornecedores = await this.fornecedoresRepository.findFornecedoresAll();
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Fornecedores por ID */
  async getOne(
    req: Request<{ fornecedoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedoresId = Number(req.params.fornecedoresId);

    if (isNaN(fornecedoresId) || fornecedoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid fornecedoresId' }).end();
    }

    try {
      const fornecedores = await this.fornecedoresRepository.findFornecedoresById(fornecedoresId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Fornecedores por Nome */
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
      const fornecedores = await this.fornecedoresRepository.findFornecedoresByName(name);
      return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Fornecedores por Fantasia */
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
      const fornecedores = await this.fornecedoresRepository.findFornecedoresByFantasy(fantasy);
      return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas os Fornecedores de mesmo ID de Pessoa */
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
      const fornecedores = await this.fornecedoresRepository.findFornecedoresAllByPessoaId(pessoaId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos Fornecedores de mesmo ID de Empresa */
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
      const fornecedores = await this.fornecedoresRepository.findFornecedoresAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }
}

