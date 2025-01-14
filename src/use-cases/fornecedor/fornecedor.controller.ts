
import type { NextFunction, Request, Response } from 'express';

import type { FornecedorRepository } from './fornecedor.repository';
import { FornecedorCreate, FornecedorUpdate } from './fornecedor.dto';

export class FornecedorController {
  constructor(private readonly fornecedorRepository: FornecedorRepository) {}
  
  /** POST Cria um novo registro de Fornecedor */
  async create(
    req: Request<{}, {}, FornecedorCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedor = await this.fornecedorRepository.createFornecedor(req.body);
      return res.status(201).send({ success: true, fornecedor });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Fornecedor */
  async update(
    req: Request<{ fornecedorId: string }, {}, Partial<FornecedorUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedorId = Number(req.params.fornecedorId);
    if (isNaN(fornecedorId) || fornecedorId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid fornecedorId' })
        .end();
    }
  
    try {
      const fornecedor = await this.fornecedorRepository.updateFornecedor(fornecedorId, req.body);
      return res.status(200).send({ success: true, fornecedor }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Fornecedor */
  async remove(
    req: Request<{ fornecedorId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedorId = Number(req.params.fornecedorId);
    if (isNaN(fornecedorId) || fornecedorId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid fornecedorId' }).end();
    }

    try {
      const deleted = await this.fornecedorRepository.deleteFornecedor(fornecedorId);
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
      const fornecedores = await this.fornecedorRepository.findFornecedorAll();
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Fornecedor por ID */
  async getOne(
    req: Request<{ fornecedorId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedorId = Number(req.params.fornecedorId);

    if (isNaN(fornecedorId) || fornecedorId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid fornecedorId' }).end();
    }

    try {
      const fornecedor = await this.fornecedorRepository.findFornecedorById(fornecedorId);
      return res.status(200).send({ success: true, fornecedor });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Fornecedor por Nome */
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
      const fornecedor = await this.fornecedorRepository.findFornecedorByName(name);
      return res.status(200).send({ success: true, fornecedor }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Fornecedor por Fantasia */
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
      const fornecedor = await this.fornecedorRepository.findFornecedorByFantasy(fantasy);
      return res.status(200).send({ success: true, fornecedor }).end();
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
      const fornecedores = await this.fornecedorRepository.findFornecedorAllByPessoaId(pessoaId);
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
      const fornecedores = await this.fornecedorRepository.findFornecedorAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }
}

