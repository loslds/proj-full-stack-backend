import type { NextFunction, Request, Response } from 'express';
import type { EmpresaRepository } from './empresa.repository';
import { EmpresaCreate, EmpresaUpdate } from './empresa.dto';

export class EmpresaController {  
  constructor(private readonly empresaRepository: EmpresaRepository) {}
  
/** POST Cria um novo registro de Empresa */
async create(
  req: Request<{}, {}, EmpresaCreate>,
  res: Response,
  next: NextFunction
) {
  try {
    const empresa = await this.empresaRepository.createEmpresa(req.body);
    return res.status(201).send({ success: true, empresa });
  } catch (error) {
    next(error);
  }
}

/** PATCH Atualiza um registro de Empresa */
async update(
  req: Request<{ empresaId: string }, {}, Partial<EmpresaUpdate>>,
  res: Response,
  next: NextFunction
) {
  const empresaId = Number(req.params.empresaId);
  if (isNaN(empresaId) || empresaId <= 0) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid empresaId' })
      .end();
  }
  
  try {
    const empresa = await this.empresaRepository.updateEmpresa(empresaId, req.body);
    return res.status(200).send({ success: true, empresa }).end();
  } catch (error) {
    next(error);
  }
}
  

  /** DELETE Remove um registro de Empresa */
  async remove(
    req: Request<{ empresaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresaId = Number(req.params.empresaId);
    if (isNaN(empresaId) || empresaId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresaId' }).end();
    }

    try {
      const deleted = await this.empresaRepository.deleteEmpresa(empresaId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Empresa */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const empresas = await this.empresaRepository.findEmpresaAll();
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Empresa por ID */
  async getOne(
    req: Request<{ empresaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresaId = Number(req.params.empresaId);

    if (isNaN(empresaId) || empresaId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresaId' }).end();
    }

    try {
      const empresa = await this.empresaRepository.findEmpresaById(empresaId);
      return res.status(200).send({ success: true, empresa });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Empresa por Nome */
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
      const empresa = await this.empresaRepository.findEmpresaByName(name);
      return res.status(200).send({ success: true, empresa }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Empresa por Nome Fantasia */
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
      const empresa = await this.empresaRepository.findEmpresaByFantasy(fantasy);
      return res.status(200).send({ success: true, empresa }).end();
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
      const empresas = await this.empresaRepository.findEmpresasAllByIdPessoa(pessoaId);
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }

}
