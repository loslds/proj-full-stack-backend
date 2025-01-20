import type { NextFunction, Request, Response } from 'express';
import type { PessoaRepository } from './pessoa.repository';
import { PessoaCreate, PessoaUpdate } from './pessoa.dto';

export class PessoaController {
  constructor(private readonly pessoaRepository: PessoaRepository) {}

  /** POST Cria tabela Pessoa */
  async create(req: Request<{}, {}, PessoaCreate>, res: Response, next: NextFunction) {
    try {
      const pessoa = await this.pessoaRepository.createPessoa(req.body);
      return res.status(201).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Pessoa */
  async update(req: Request<{ pessoaId: string }, {}, Partial<PessoaUpdate>>, res: Response, next: NextFunction) {
    const pessoaId = this.validatePessoaId(req.params.pessoaId, res);
    if (!pessoaId) return;

    try {
      const pessoa = await this.pessoaRepository.updatePessoa(pessoaId, req.body);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Pessoa */
  async remove(req: Request<{ pessoaId: string }>, res: Response, next: NextFunction) {
    const pessoaId = this.validatePessoaId(req.params.pessoaId, res);
    if (!pessoaId) return;

    try {
      const deleted = await this.pessoaRepository.deletePessoa(pessoaId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Pessoa */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pessoas = await this.pessoaRepository.findPessoaAll();
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa por ID */
  async getOne(req: Request<{ pessoaId: string }>, res: Response, next: NextFunction) {
    const pessoaId = this.validatePessoaId(req.params.pessoaId, res);
    if (!pessoaId) return;

    try {
      const pessoa = await this.pessoaRepository.findPessoaById(pessoaId);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa por NmPessoa */
  async findByNmPessoa(req: Request<{}, {}, {}, { nmpessoa: string }>, res: Response, next: NextFunction) {
    const { nmpessoa } = req.query;
    if (!nmpessoa) {
      return res.status(400).send({ success: false, message: 'nmpessoa parameter is required' });
    }

    try {
      const pessoa = await this.pessoaRepository.findPessoaByNmPessoa(nmpessoa);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoa pela Sigla */
  async findBySigla(req: Request<{}, {}, {}, { sigla: string }>, res: Response, next: NextFunction) {
    const { sigla } = req.query;
    if (!sigla) {
      return res.status(400).send({ success: false, message: 'sigla parameter is required' });
    }

    try {
      const pessoa = await this.pessoaRepository.findPessoaBySigla(sigla);
      return res.status(200).send({ success: true, pessoa });
    } catch (error) {
      next(error);
    }
  }

  /** Utility to validate pessoaId */
  private validatePessoaId(pessoaId: string, res: Response): number | null {
    const id = Number(pessoaId);
    if (isNaN(id) || id <= 0) {
      res.status(400).send({ success: false, message: 'Invalid pessoaId' });
      return null;
    }
    return id;
  }
}
