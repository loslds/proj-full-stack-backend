import type { NextFunction, Request, Response } from 'express';
import type { EmpresasRepository } from './empresas.repository';
import { EmpresasCreate, EmpresasUpdate } from './empresas.dto';

export class EmpresasController {  
  constructor(private readonly empresasRepository: EmpresasRepository) {}
  
/** POST Cria Tabela Empresas */
async create(
  req: Request<{}, {}, EmpresasCreate>,
  res: Response,
  next: NextFunction
) {
  try {
    const empresas = await this.empresasRepository.createEmpresas(req.body);
    return res.status(201).send({ success: true, empresas });
  } catch (error) {
    next(error);
  }
}

/** PATCH Atualiza um registro de Empresas */
async update(
  req: Request<{ empresasId: string }, {}, Partial<EmpresasUpdate>>,
  res: Response,
  next: NextFunction
) {
  const empresasId = Number(req.params.empresasId);
  if (isNaN(empresasId) || empresasId <= 0) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid empresasId' })
      .end();
  }
  
  try {
    const empresas = await this.empresasRepository.updateEmpresas(empresasId, req.body);
    return res.status(200).send({ success: true, empresas }).end();
  } catch (error) {
    next(error);
  }
}
  

  /** DELETE Remove um registro de Empresas */
  async remove(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresasId = Number(req.params.empresasId);
    if (isNaN(empresasId) || empresasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresasId' }).end();
    }

    try {
      const deleted = await this.empresasRepository.deleteEmpresas(empresasId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }
//////////////////////////////////////////////
  /** GET Busca todos os registros de Empresa */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const empresas = await this.empresasRepository.findEmpresasAll();
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Empresas por ID */
  async getOne(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresasId = Number(req.params.empresasId);

    if (isNaN(empresasId) || empresasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresasId' }).end();
    }

    try {
      const empresas = await this.empresasRepository.findEmpresasById(empresasId);
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Empresas por Nome */
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
      const empresas = await this.empresasRepository.findEmpresasByName(name);
      return res.status(200).send({ success: true, empresas }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Empresas por Nome Fantasia */
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
      const empresas = await this.empresasRepository.findEmpresasByFantasy(fantasy);
      return res.status(200).send({ success: true, empresas }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas as empresass pelo ID de Pessoa */
  async findAllByPessoaId(
    req: Request<{ pessoaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoaId = Number(req.params.pessoaId);
    if (isNaN(pessoaId) || pessoaId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoasId' }).end();
    }

    try {
      const empresas = await this.empresasRepository.findEmpresasByPessoaId(pessoaId);
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }

}
