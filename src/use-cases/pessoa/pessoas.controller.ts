
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.controller.ts
import { NextFunction, Request, Response } from 'express';
import { PessoasRepository } from './pessoas.repository';
import { PessoasCreate, PessoasUpdate } from './pessoas.dto';
import { PessoasEntity } from './pessoas.entity';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { HttpException } from '../../middlewares/HttpException';

export class PessoasController {
  constructor(private readonly pessoasRepository: PessoasRepository) {}

/** POST Cria um novo registro de Pessoas */
  async create(
    req: Request<{}, {}, PessoasCreate>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { nome, sigla} = body
    try {
      const exists = await this.pessoasRepository.hasDuplicated(nome, sigla)
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
    const { nome, sigla} = body
    try {
      const pessoasId = Number(params?.pessoasId);
      if(!pessoasId) throw new HttpException(400,'id da pessoa invalido')
      
      const exists = await this.pessoasRepository.hasDuplicated(nome, sigla, [pessoasId])
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
      
      const { ativo } = req.query; // ex: ?ativo=true

      let where: FindOptionsWhere<PessoasEntity> | undefined;

      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<PessoasEntity>;
      }

      const pessoas = await this.pessoasRepository.findPessoasAll( where, { nome: "ASC" } );

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
      const { id, nome, sigla } = req.query;

      // Convertendo 'id' para número, caso seja enviado
      const searchParams = {
        id: id ? Number(id) : undefined,
        nome: nome as string,
        sigla: sigla as string,
      };

      // Chamando o método do repository
      const pessoas = await   this.pessoasRepository.searchPessoas(searchParams);
      return res.json(pessoas);
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento
    }
  }

  /** GET Pesquisa registros de Pessoa por nome */
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

  /** GET Pesquisa registros de Pessoa por sigla */
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

  /** GET Busca um registro de Pessoa por nome */
  async findOneNome(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) {
        return res.status(400).send({ success: false, message: 'nome parameter is required' });
      }
      const pessoas = await this.pessoasRepository.findOneNomePessoas(nome);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

/** GET Busca todos os registros de Pessoa por nome */
async findAllNome(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const nome = req.query?.nome as string;
    if (!nome) {
      return res.status(400).send({ success: false, message: "nome parameter is required" });
    }
    const pessoas = await this.pessoasRepository.findAllNomePessoas(nome);
    if (pessoas.length === 0) {
      return res.status(404).send({ success: false, message: "Nenhuma pessoa encontrada com esse nome" });
    }
    return res.status(200).send({ success: true, pessoas });
  } catch (error) {
    next(error);
    }
  } 
  
/** GET Busca um registro de Pessoa por sigla */
async findOneSigla(
  req: Request,
  res: Response,
  next: NextFunction
  ) {
    try {
      const nome = req.query?.nome as string;
      if (!nome) {
      return res.status(400).send({ success: false, message: 'sigla parameter is required' });
      }
      const pessoas = await this.pessoasRepository.findOneSiglaPessoas(nome);
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }

/** GET Busca todos os registros de Pessoa por sigla */
async findAllSigla(
  req: Request,
  res: Response,
  next: NextFunction
 ) {
  try {
    const sigla = req.query?.sigla as string;
    if (!sigla) {
      return res.status(400).send({ success: false, message: "sigla parameter is required" });
    }
      const pessoas = await this.pessoasRepository.findAllSiglaPessoas(sigla);
      if (pessoas.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma pessoa encontrada com esse sigla" });
      }
      return res.status(200).send({ success: true, pessoas });
    } catch (error) {
      next(error);
    }
  }
}

