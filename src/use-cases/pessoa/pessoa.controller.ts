import { NextFunction, Request, Response } from 'express';
import { PessoaRepository } from './pessoa.repository';
import { PessoaCreate, PessoaUpdate } from './pessoa.dto';
import { PessoaEntity } from './pessoa.entity';
import { DeepPartial } from 'typeorm';

export class PessoaController {
  constructor(private readonly pessoaRepository: PessoaRepository) {}

/** POST Cria um novo registro de Pessoa */
  async create(
    req: Request<{}, {}, PessoaCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pessoa = await this.pessoaRepository.createPessoa(req.body);
      return res.status(201).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Pessoa */
  async update(
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
      const pessoa = await this.pessoaRepository.updatePessoa(
        pessoaId,
        req.body as DeepPartial<PessoaEntity>
      );
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Pessoa */
  async remove(
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
      await this.pessoaRepository.deletePessoa(pessoaId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Pessoa */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pessoa = await this.pessoaRepository.findPessoalAll();
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa por ID */
  async getOne(
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
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  ///////////////////////////////

  /** GET Lista todos os registros de Pessoa por nmpessoa */
  async findAllNmpessoa(
    req: Request<{}, {}, {}, { nmpessoa: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nmpessoa } = req.query;
      if (!nmpessoa) {
        return res.status(400).send({ success: false, message: 'nmpessoa parameter is required' });
      }
      const pessoa = await this.pessoaRepository.findPessoaAllNmpessoa(nmpessoa);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa por nmpessoa */
  async findByNmpessoa(
    req: Request<{}, {}, {}, { nmpessoa: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nmpessoa } = req.query;
      if (!nmpessoa) {
        return res.status(400).send({ success: false, message: 'nmpessoa parameter is required' });
      }
      const pessoa = await this.pessoaRepository.findPessoaByNmpessoa(nmpessoa);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Pessoa por sigla */
  async findAllSigla(
    req: Request<{}, {}, {}, { sigla: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sigla } = req.query;
      if (!sigla) {
        return res.status(400).send({ success: false, message: 'sigla parameter is required' });
      }
      const pessoa = await this.pessoaRepository.findPessoaAllSigla(sigla);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa por sigla */
  async findBySigla(
    req: Request<{}, {}, {}, { sigla: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sigla } = req.query;
      if (!sigla) {
        return res.status(400).send({ success: false, message: 'sigla parameter is required' });
      }
      const pessoa = await this.pessoaRepository.findPessoaBySigla(sigla);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }





}
