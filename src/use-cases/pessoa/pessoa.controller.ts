import { NextFunction, Request, Response } from 'express';
import { PessoasRepository } from './pessoa.repository';
import { PessoasCreate, PessoasUpdate } from './pessoa.dto';
import { PessoasEntity } from './pessoa.entity';
import { DeepPartial } from 'typeorm';
import { HttpException } from '../../services/HttpException';

export class PessoasController {
  constructor(private readonly pessoasRepository: PessoasRepository) {}

/** POST Cria um novo registro de Pessoas */
  async create(
    req: Request<{}, {}, PessoasCreate>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { nmpessoa, sigla} = body
    try {
      const exists = await this.pessoasRepository.hasDuplicated(nmpessoa, sigla)
      if(!!exists) throw new HttpException(400,'pessoa ja existe')

      const pessoas = await this.pessoasRepository.createPessoas(body);
      return res.status(201).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Pessoa */
  async update(
    req: Request<{ pessoasId: string }, {}, PessoasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const { params, body } = req
    const { nmpessoa, sigla} = body
    try {
      const pessoasId = Number(params?.pessoasId);
      if(!pessoasId) throw new HttpException(400,'id da pessoa invalido')
      
      const exists = await this.pessoasRepository.hasDuplicated(nmpessoa, sigla, [pessoasId])
      if(!!exists) throw  new HttpException(400,'pessoa ja existe')

      const pessoas = await this.pessoasRepository.updatePessoas(
        pessoasId,
        body 
      );

      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Pessoas */
  async remove(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoasId = Number(req.params.pessoasId);
    if (isNaN(pessoasId) || pessoasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoasId' })
        .end();
    }

    try {
      await this.pessoasRepository.deletePessoas(pessoasId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }



  /** GET Busca todos os registros de Pessoas */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pessoas = await this.pessoasRepository.findPessoasAll();
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoas por ID */
  async getOne(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoasId = Number(req.params.pessoasId);

    if (isNaN(pessoasId) || pessoasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoasId' })
        .end();
    }

    try {
      const pessoas = await this.pessoasRepository.findPessoasById(pessoasId);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      // Extraindo parâmetros opcionais da query
      const { id, nmpessoa, sigla } = req.query;

      // Convertendo 'id' para número, caso seja enviado
      const searchParams = {
        id: id ? Number(id) : undefined,
        nmpessoa: nmpessoa as string,
        sigla: sigla as string,
      };
      


      // Chamando o método do repository
      const pessoas = await this.pessoasRepository.searchpessoas(searchParams);
      return res.json(pessoas);
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento
    }
  }




  ///////////////////////////////

  /** GET Lista todos os registros de Pessoa por nmpessoa */
  async searchByName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text  = req.query?.text as string;
      const pessoas = await this.pessoasRepository.searchName(text);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

/** GET Lista todos os registros de Pessoa por nmpessoa */
  async searchBySigla(
   req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text  = req.query?.text as string;
      const pessoas = await this.pessoasRepository.searchSigla(text);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }


  /** GET Busca um registro de Pessoa por nmpessoa */
  async findByNmpessoa(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nmpessoa = req.query?.nmpessoa as string;
      if (!nmpessoa) {
        return res.status(400).send({ success: false, message: 'nmpessoa parameter is required' });
      }
      const pessoas = await this.pessoasRepository.findPessoasByNmpessoa(nmpessoa);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Pessoas por sigla */
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
      const pessoas = await this.pessoasRepository.findPessoasAllSigla(sigla);
      return res.status(200).send({ success: true, pessoas });
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
      const pessoas = await this.pessoasRepository.findPessoasBySigla(sigla);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }





}
