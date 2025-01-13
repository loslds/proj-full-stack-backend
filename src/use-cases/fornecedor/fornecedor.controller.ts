
import type { NextFunction, Request, Response } from 'express';

import type { FornecedorRepository } from './fornecedor.repository';
import { FornecedorCreate, FornecedorUpdate } from './fornecedor.dto';

export class FornecedorController {
  constructor(private readonly fornecedorRepository: FornecedorRepository) {}

  /** GET  Busca todos os reg. FORNECEDORES */
  async findAllFornecedor(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const fornecedores = await this.fornecedorRepository.findAllFornecedor();
    return res.status(200).send({ success: true, fornecedores }).end();
  }

  /** GET Busca um unico ID reg. FORNECEDOR */
  async getOneFornecedor(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const { params } = req;
    const fornecedorId = Number(params?.fornecedorId);

    if (!fornecedorId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid fornecedorId' })
        .end();
    }

    const fornecedor = await this.fornecedorRepository.findByIdFornecedor(fornecedorId);
    return res.status(200).send({ success: true, fornecedor }).end();
  }

  /** GET Busca um unico NAME reg. FORNECEDOR */
  async findByNameFornecedor(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const { query } = req;
    const name = query.name as string;

    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: 'Name parameter is required' })
        .end();
    }

    const empresa = await this.fornecedorRepository.findByNameFornecedor(name);
    return res.status(200).send({ success: true, empresa }).end();
  }

  /** GET Busca um unico FANTASY reg. FORNECEDOR */
  async findByFantasyFornecedor(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const { query } = req;
    const fantasia = query.fantasia as string;

    if (!fantasia) {
      return res
        .status(400)
        .send({ success: false, message: 'Fantasy parameter is required' })
        .end();
    }

    const fornecedor = await this.fornecedorRepository.findByFantasyFornecedor(fantasia);
    return res.status(200).send({ success: true, fornecedor }).end();
  }

  /** POST  grava um Reg; FORNECEDOR. */
  async createFornecedor(
    req: Request<any, any, FornecedorCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body } = req;
    const fornecedor = await this.fornecedorRepository.createFornecedor(body);
    return res.status(200).send({ success: true, fornecedor }).end();
  }

  /** PATCH  Altera um Reg. FORNECEDOR. */
  async updateFornecedor(
    req: Request<any, any, FornecedorUpdate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body, params } = req;
    const fornecedorId = Number(params?.fornecedorId);

    if (!fornecedorId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid fornecedorId' })
        .end();
    }

    const fornecedor = await this.fornecedorRepository.updateFornecedor(fornecedorId, body);
    return res.status(200).send({ success: true, fornecedor }).end();
  }

  /** DEL um unico Reg. FORNECEDOR. */
  async removeFornecedor(
    req: Request<any, any, FornecedorCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { params } = req;
    const fornecedorId = Number(params?.fornecedorId);

    if (!fornecedorId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid fornecedorId' })
        .end();
    }

    const deletedFornecedor = await this.fornecedorRepository.deleteFornecedor(fornecedorId);
    return res.status(200).send({ success: !!deletedFornecedor?.affected }).end();
  }

  /** GET Busca todas os FORNECEDORES de mesma id_pessoa */
  async findAllFornecedoresByPessoaId(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {

  const pessoaId = Number(req.params?.pessoaId);

  if (!pessoaId) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid pessoaId' })
      .end();
  }

  const fornecedores = await  this.fornecedorRepository.findAllFornecedorByPessoaId(pessoaId);
  return res.status(200).send({ success: true, fornecedores }).end();
  }

  /** GET Busca todas os FORNECEDORES de mesma id_empresa */
    async findAllFornecedoresByEmpresaId(
      req: Request<any, any, any>,
      res: Response<Record<string, any>>,
      _next: NextFunction,
    ) {
  
    const empresaId = Number(req.params?.empresaId);
  
    if (!empresaId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid empresaId' })
        .end();
    }
  
    const fornecedores = await  this.fornecedorRepository.findAllFornecedorByEmpresaId(empresaId);
    return res.status(200).send({ success: true, fornecedores }).end();
    }
  
}

