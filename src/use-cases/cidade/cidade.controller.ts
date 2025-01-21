import type { NextFunction, Request, Response } from 'express';
import type { CidadeRepository } from './cidade.repository';
import { CidadeCreate, CidadeUpdate } from './cidade.dto';

export class CidadeController {  
  constructor(private readonly cidadeRepository: CidadeRepository) {}
  
/** POST Cria Tabela Empresa */
async create(
  req: Request<{}, {}, CidadeCreate>,
  res: Response,
  next: NextFunction
) {
  try {
    const cidade = await this.cidadeRepository.createCidade(req.body);
    return res.status(201).send({ success: true, cidade });
  } catch (error) {
    next(error);
  }
}

/** PATCH Atualiza um registro de Cidade */
async update(
  req: Request<{ cidadeId: string }, {}, Partial<CidadeUpdate>>,
  res: Response,
  next: NextFunction
) {
  const cidadeId = Number(req.params.cidadeId);
  if (isNaN(cidadeId) || cidadeId <= 0) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid cidadeId' })
      .end();
  }
  
  try {
    const cidade = await this.cidadeRepository.updateCidade(cidadeId, req.body);
    return res.status(200).send({ success: true, cidade }).end();
  } catch (error) {
    next(error);
  }
}
  

  /** DELETE Remove um registro de Empresa */
  async remove(
    req: Request<{ cidadeId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadeId = Number(req.params.cidadeId);
    if (isNaN(cidadeId) || cidadeId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid cidadeId' }).end();
    }

    try {
      const deleted = await this.cidadeRepository.deleteCidade(cidadeId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }


  /** GET Lista um reg. Id em Cidade */
  async getOne(
    req: Request<{ cidadeId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadeId = Number(req.params.cidadeId);

    if (isNaN(cidadeId) || cidadeId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid cidadeId' }).end();
    }

    try {
      const cidade = await this.cidadeRepository.findCidadeById(cidadeId);
      return res.status(200).send({ success: true, cidade });
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
      const cidades = await this.cidadeRepository.findCidadeAll();
      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }
    

  /** GET Lista um reg. nmcidade em Cidade */
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
      const cidade = await this.cidadeRepository.findCidadeByNmCidade(nmcidade);
      return res.status(200).send({ success: true, cidade }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos Reg. nmcidade em Cidade */
  async findAllNmCidade(
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
      const cidade = await this.cidadeRepository.findCidadeAllNmCidade(nmcidade);
      return res.status(200).send({ success: true, cidade }).end();
    } catch (error) {
      next(error);
    }
  }


  /** GET Lista um reg. nmestado em Cidade */
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
      const cidade = await this.cidadeRepository.findCidadeByNmEstado(nmestado);
      return res.status(200).send({ success: true, cidade }).end();
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
      const cidade = await this.cidadeRepository.findCidadeAllNmEstado(nmestado);
      return res.status(200).send({ success: true, cidade }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos reg. uf em Cidade */
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
      const cidade = await this.cidadeRepository.findCidadeAllUf(uf);
      return res.status(200).send({ success: true, cidade }).end();
    } catch (error) {
      next(error);
    }
  }

}
