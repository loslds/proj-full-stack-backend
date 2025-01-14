
import type { NextFunction, Request, Response } from 'express';

import type { FuncionarioRepository } from './funcionario.repository';
import { FuncionarioCreate, FuncionarioUpdate } from './funcionario.dto';

export class FuncionarioController {
  constructor(private readonly funcionarioRepository: FuncionarioRepository) {}
  
  /** POST Cria um novo registro de Funcionario */
  async create(
    req: Request<{}, {}, FuncionarioCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionario = await this.funcionarioRepository.createFuncionario(req.body);
      return res.status(201).send({ success: true, funcionario });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Funcionario */
  async update(
    req: Request<{ funcionarioId: string }, {}, Partial<FuncionarioUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const funcionarioId = Number(req.params.funcionarioId);
    if (isNaN(funcionarioId) || funcionarioId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid funcionarioId' })
        .end();
    }
  
    try {
      const funcionario = await this.funcionarioRepository.updateFuncionario(funcionarioId, req.body);
      return res.status(200).send({ success: true, funcionario }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** DELETE Remove um registro de Funcionario */
  async remove(
    req: Request<{ funcionarioId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const funcionarioId = Number(req.params.funcionarioId);
    if (isNaN(funcionarioId) || funcionarioId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid funcionarioId' }).end();
    }

    try {
      const deleted = await this.funcionarioRepository.deleteFuncionario(funcionarioId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Funcionario */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const funcionarios = await this.funcionarioRepository.findFuncionarioAll();
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Funcionario por ID */
  async getOne(
    req: Request<{ funcionarioId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const funcionarioId = Number(req.params.funcionarioId);

    if (isNaN(funcionarioId) || funcionarioId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid funcionarioId' }).end();
    }

    try {
      const funcionario = await this.funcionarioRepository.findFuncionarioById(funcionarioId);
      return res.status(200).send({ success: true, funcionario });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Funcionario por Nome */
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
      const funcionario = await this.funcionarioRepository.findFuncionarioByName(name);
      return res.status(200).send({ success: true, funcionario }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Funcionario por Fantasia */
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
      const funcionario = await this.funcionarioRepository.findFuncionarioByFantasy(fantasy);
      return res.status(200).send({ success: true, funcionario }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas os Funcionario de mesmo ID de Pessoa */
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
      const funcionarios = await this.funcionarioRepository.findFuncionarioAllByPessoaId(pessoaId);
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
      const funcionarios = await this.funcionarioRepository.findFuncionarioAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }
}

