import type { NextFunction, Request, Response } from 'express';
import type { PessoaRepository } from './pessoa.repository';
import { PessoaCreate, PessoaUpdate } from './pessoa.dto';

export class PessoaController {
  constructor(private readonly pessoaRepository: PessoaRepository) {}

  /** POST Cria uma nova pessoa */
  async createPessoa(
    req: Request<{}, {}, PessoaCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoa = await this.pessoaRepository.createPessoa(req.body);
      return res.status(201).send({ success: true, pessoa }).end();
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza uma pessoa */
  async updatePessoa(
    req: Request<{ pessoaId: string }, {}, PessoaUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const pessoaId = Number(req.params.pessoaId);

    if (isNaN(pessoaId) || pessoaId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoaId' })
        .end();
    }

    try {
      const pessoa = await this.pessoaRepository.updatePessoa(pessoaId, req.body);
      return res.status(200).send({ success: true, pessoa }).end();
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove uma pessoa */
  async removePessoa(
    req: Request<{ pessoaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoaId = Number(req.params.pessoaId);

    if (isNaN(pessoaId) || pessoaId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoaId' })
        .end();
    }

    try {
      const deletedPessoa = await this.pessoaRepository.deletePessoa(pessoaId);
      return res.status(200).send({ success: !!deletedPessoa?.affected }).end();
    } catch (error) {
      next(error);
    }
  }

    /** GET Busca todas as pessoas */
    async findAllPessoa(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const pessoas = await this.pessoaRepository.findPessoaAll();
        return res.status(200).send({ success: true, pessoas }).end();
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca uma pessoa pelo ID */
    async getOnePessoa(
      req: Request<{ pessoaId: string }>,
      res: Response,
      next: NextFunction
    ) {
      const pessoaId = Number(req.params.pessoaId);
  
      if (isNaN(pessoaId) || pessoaId <= 0) {
        return res
          .status(400)
          .send({ success: false, message: 'Invalid pessoaId' })
          .end();
      }
  
      try {
        const pessoa = await this.pessoaRepository.findPessoaById(pessoaId);
        return res.status(200).send({ success: true, pessoa }).end();
      } catch (error) {
        next(error);
      }
    }
}

