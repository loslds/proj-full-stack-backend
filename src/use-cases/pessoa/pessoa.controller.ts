import type { NextFunction, Request, Response } from 'express';

import type { PessoaRepository } from './pessoa.repository';
import { PessoaCreate, PessoaUpdate } from './pessoa.dto';

export class PessoaController {
  constructor(private readonly pessoaRepository: PessoaRepository) {}

  /** GET */
  async findPessoaAll(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const pessoas = await this.pessoaRepository.findPessoaAll();
    return res.status(200).send({ success: true, pessoas }).end();
  }

  /** GET */
  async getOne(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const { params } = req;
    const pessoaId = Number(params?.pessoaId);

    if (!pessoaId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoaId' })
        .end();
    }

    const pessoa = await this.pessoaRepository.findPessoaById(pessoaId);
    return res.status(200).send({ success: true, pessoa }).end();
  }

  /** POST */
  async create(
    req: Request<any, any, PessoaCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body } = req;
    const pessoa = await this.pessoaRepository.create(body);
    return res.status(200).send({ success: true, pessoa }).end();
  }

  /** PATCH */
  async update(
    req: Request<any, any, PessoaUpdate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body, params } = req;
    const pessoaId = Number(params?.pessoaId);

    if (!pessoaId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoaId' })
        .end();
    }

    const pessoa = await this.pessoaRepository.update(pessoaId, body);
    return res.status(200).send({ success: true, pessoa }).end();
  }

  /** DEL */
  async remove(
    req: Request<any, any, PessoaCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { params } = req;
    const pessoaId = Number(params?.pessoaId);

    if (!pessoaId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoaId' })
        .end();
    }

    const deleted = await this.pessoaRepository.delete(pessoaId);
    return res.status(200).send({ success: !!deleted?.affected }).end();
  }
}
