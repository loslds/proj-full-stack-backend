import type { NextFunction, Request, Response } from 'express';
import type { CidadesRepository } from './cidades.repository';
import { CidadesCreate, CidadesUpdate } from './cidades.dto';

export class CidadesController {  
  constructor(private readonly cidadesRepository: CidadesRepository) {}
  
/** POST Cria Tabela Cidades */
async create(
  req: Request<{}, {}, CidadesCreate>,
  res: Response,
  next: NextFunction
) {
  try {
    const cidades = await this.cidadesRepository.createCidades(req.body);
    return res.status(201).send({ success: true, cidades });
  } catch (error) {
    next(error);
  }
}

/** PATCH Atualiza um registro de Cidades */
async update(
  req: Request<{ cidadesId: string }, {}, Partial<CidadesUpdate>>,
  res: Response,
  next: NextFunction
) {
  const cidadesId = Number(req.params.cidadesId);
  if (isNaN(cidadesId) || cidadesId <= 0) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid cidadesId' })
      .end();
  }
  
  try {
    const cidades = await this.cidadesRepository.updateCidades(cidadesId, req.body);
    return res.status(200).send({ success: true, cidades }).end();
  } catch (error) {
    next(error);
  }
}
  

  /** DELETE Remove um registro de Cidades */
  async remove(
    req: Request<{ cidadesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);
    if (isNaN(cidadesId) || cidadesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid cidadesId' }).end();
    }

    try {
      const deleted = await this.cidadesRepository.deleteCidades(cidadesId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }


  /** GET Lista um reg. Id em Cidades */
  async getOne(
    req: Request<{ cidadesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);

    if (isNaN(cidadesId) || cidadesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid cidadesId' }).end();
    }

    try {
      const cidades = await this.cidadesRepository.findCidadesById(cidadesId);
      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos reg. em Cidade */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const cidades = await this.cidadesRepository.findCidadesAll();
      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }
    

  /** GET Lista um reg. nmcidade em Cidades */
  async findByNmCidade(
    req: Request<{}, {}, {}, Partial<{ nmcidade: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nmcidade } = req.query;

    if (!nmcidade) {
      return res
        .status(400)
        .send({ success: false, message: 'Name Cidade parameter is required' })
        .end();
    }

    try {
      const cidades = await this.cidadesRepository.findCidadesByNmCidade(nmcidade);
      return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos Reg. nmcidade em Cidades */
  async findAllNmCidade(
    req: Request<{}, {}, {}, Partial<{ nmcidade: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nmcidade } = req.query;

    if (!nmcidade) {
      return res
        .status(400)
        .send({ success: false, message: 'Name Cidades parameter is required' })
        .end();
    }

    try {
      const cidades = await this.cidadesRepository.findCidadesAllNmCidade(nmcidade);
      return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }


  /** GET Lista um reg. nmestado em Cidades */
  async findByNmEstado(
    req: Request<{}, {}, {}, Partial<{ nmestado: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nmestado } = req.query;

    if (!nmestado) {
      return res
        .status(400).send({ success: false, message: 'Name Estado parameter is required' }).end();
    }

    try {
      const cidades = await this.cidadesRepository.findCidadesByNmEstado(nmestado);
      return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos reg. nmestado em Cidade */
  async findAllNmEstado(
    req: Request<{}, {}, {}, Partial<{ nmestado: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nmestado } = req.query;

    if (!nmestado) {
      return res
        .status(400).send({ success: false, message: 'Name Estado parameter is required' }).end();
    }

    try {
      const cidades = await this.cidadesRepository.findCidadesAllNmEstado(nmestado);
      return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos reg. uf em Cidades */
  async findAllUf(
    req: Request<{}, {}, {}, Partial<{ uf: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { uf } = req.query;

    if (!uf) {
      return res
        .status(400).send({ success: false, message: 'Uf Estado parameter is required' }).end();
    }

    try {
      const cidades = await this.cidadesRepository.findCidadesAllUf(uf);
      return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Email por cadastroId */
  async findByCadastroId(
    req: Request<{ cadastroId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastroId = Number(req.params.cadastroId);
      const cidades = await this.cidadesRepository.findCidadesByCadastroId(cadastroId);
      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }

}
