
import type { NextFunction, Request, Response } from 'express';

import type { EmpresaRepository } from './empresa.repository';
import { EmpresaCreate, EmpresaUpdate } from './empresa.dto';

export class EmpresaController {
  constructor(private readonly empresaRepository: EmpresaRepository) {}

  /** GET  Busca todos os reg. Empresa */
  async findEmpresaAll(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const empresas = await this.empresaRepository.findEmpresaAll();
    return res.status(200).send({ success: true, empresas }).end();
  }

  /** GET Busca um unico ID reg. Empresa */
  async getOne(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const { params } = req;
    const empresaId = Number(params?.empresaId);

    if (!empresaId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid empresaId' })
        .end();
    }

    const empresa = await this.empresaRepository.findEmpresaById(empresaId);
    return res.status(200).send({ success: true, empresa }).end();
  }

  /** GET Busca um unico name reg. Empresa */
  async findByName(
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

    const empresa = await this.empresaRepository.findEmpresaByName(name);
    return res.status(200).send({ success: true, empresa }).end();
  }

  /** GET Busca um unico fantasy reg. Empresa */
  async findByFantasy(
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

    const empresa = await this.empresaRepository.findEmpresaByFantasy(fantasia);
    return res.status(200).send({ success: true, empresa }).end();
  }

  /** POST  grava um Reg; Empresa. */
  async create(
    req: Request<any, any, EmpresaCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body } = req;
    const empresa = await this.empresaRepository.createEmpresa(body);
    return res.status(200).send({ success: true, empresa }).end();
  }

  /** PATCH  Altera um Reg. Empresa. */
  async update(
    req: Request<any, any, EmpresaUpdate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body, params } = req;
    const empresaId = Number(params?.moduloId);

    if (!empresaId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid empresaId' })
        .end();
    }

    const empresa = await this.empresaRepository.updateEmpresa(empresaId, body);
    return res.status(200).send({ success: true, empresa }).end();
  }

  /** DEL um unico Reg. Empresa. */
  async remove(
    req: Request<any, any, EmpresaCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { params } = req;
    const empresaId = Number(params?.empresaId);

    if (!empresaId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid empresaId' })
        .end();
    }

    const deleted = await this.empresaRepository.deleteEmpresa(empresaId);
    return res.status(200).send({ success: !!deleted?.affected }).end();
  }

  /** GET Busca todas as empresas pelo id_pessoa */
  async findAllByPessoaId(
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

  const empresas = await  this.empresaRepository.findEmpresasByPessoaId(pessoaId);
  return res.status(200).send({ success: true, empresas }).end();
  }

}

