
import type { NextFunction, Request, Response } from 'express';

import type { FuncionariosRepository } from './funcionarios.repository';
import { FuncionariosCreate, FuncionariosUpdate } from './funcionarios.dto';

export class FuncionariosController {
  constructor(private readonly funcionariosRepository: FuncionariosRepository) {}
  
  /** POST Cria um novo registro de Funcionarios */
  async create(
    req: Request<{}, {}, FuncionariosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionarios = await this.funcionariosRepository.createFuncionarios(req.body);
      return res.status(201).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Funcionarios */
  async update(
    req: Request<{ funcionariosId: string }, {}, Partial<FuncionariosUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const funcionariosId = Number(req.params.funcionariosId);
    if (isNaN(funcionariosId) || funcionariosId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid funcionariosId' })
        .end();
    }
  
    try {
      const funcionarios = await this.funcionariosRepository.updateFuncionarios(funcionariosId, req.body);
      return res.status(200).send({ success: true, funcionarios }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Funcionarios */
  async remove(
    req: Request<{ funcionariosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const funcionariosId = Number(req.params.funcionariosId);
    if (isNaN(funcionariosId) || funcionariosId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid funcionariosId' }).end();
    }

    try {
      const deleted = await this.funcionariosRepository.deleteFuncionarios(funcionariosId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Funcionarios */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const funcionarios = await this.funcionariosRepository.findFuncionariosAll();
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Funcionarios por ID */
  async getOne(
    req: Request<{ funcionariosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const funcionariosId = Number(req.params.funcionariosId);

    if (isNaN(funcionariosId) || funcionariosId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid funcionariosId' }).end();
    }

    try {
      const funcionarios = await this.funcionariosRepository.findFuncionariosById(funcionariosId);
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Funcionarios por Nome */
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
      const funcionarios = await this.funcionariosRepository.findFuncionariosByName(name);
      return res.status(200).send({ success: true, funcionarios }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Funcionarios por Fantasia */
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
      const funcionarios = await this.funcionariosRepository.findFuncionariosByFantasy(fantasy);
      return res.status(200).send({ success: true, funcionarios }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas os Funcionarios de mesmo ID de Pessoa */
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
      const funcionarios = await this.funcionariosRepository.findFuncionariosAllByPessoaId(pessoaId);
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos Funcionarios de mesmo ID de Empresa */
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
      const funcionarios = await this.funcionariosRepository.findFuncionariosAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }
}

