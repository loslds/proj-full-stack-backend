import { NextFunction, Request, Response } from 'express';
import { SystableCreate, SystableUpdate } from './systable.dto';
import { SystableRepository } from './systable.repository';
import { SystableDto } from './systable.dto';
import { SystablesEntity } from './systable.entity';
import { DeepPartial } from 'typeorm';
import { HttpException } from '../../middlewares/HttpException';

export class SystableController {
  constructor(private readonly SystablesRepository: SystableRepository) {}

/** POST Cria um novo registro de systable */
  async create(
    req: Request<{}, {}, SystableCreate>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { nome, chkdb} = body
    try {
      const exists = await this.SystablesRepository.hasDuplicated(nome, chkdb)
      if(!!exists) throw new HttpException(400,'systable ja existe')

      const systable = await this.SystablesRepository.createSystable(body);
      return res.status(201).send({ success: true, systable });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de systable */
  async update(
    req: Request<{ systableId: string }, {}, SystableUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const { params, body } = req
    const { nome, chkdb} = body
    try {
      const systableId = Number(params?.systableId);
      if(!systableId) throw new HttpException(400,'Reg. id em Systable invalido')
      
      const exists = await this.SystablesRepository.hasDuplicated(nome, chkdb, [systableId])
      if(!!exists) throw  new HttpException(400,'Reg. em systable ja existe')

      const systable = await this.SystablesRepository.updateSystable(
        systableId,
        body 
      );

      return res.status(200).send({ success: true, systable });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de systable */
  async remove(
    req: Request<{ systableId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const systableId = Number(req.params.systableId);
    if (isNaN(systableId) || systableId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid systableId' })
        .end();
    }

    try {
      await this.SystablesRepository.deleteSystable(systableId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Datasys */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const systable = await this.SystablesRepository.findSystableAll();
      return res.status(200).send({ success: true, systable });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de systable por ID */
  async getOne(
    req: Request<{ systableId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const systableId = Number(req.params.systableId);

    if (isNaN(systableId) || systableId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid systable' })
        .end();
    }

    try {
      const systable = await this.SystablesRepository.findSystableById(systableId);
      return res.status(200).send({ success: true, systable });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de systable pelo Parametro : { ID ou nome, chkdb } */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      // Extraindo parâmetros opcionais da query
      const { id, nome, chkdb } = req.query;

      // Normalizando os parâmetros
      const searchParams: {
        id?: number;
        nome?: string;
        chkdb?: number;
      } = {};

      if (id && !isNaN(Number(id))) {
        searchParams.id = Number(id);
      }

      if (nome && typeof nome === "string") {
        searchParams.nome = nome;
      }

      if (chkdb !== undefined) {
        searchParams.chkdb = Number(chkdb) === 1 ? 1 : 0; // força tinyint (0 ou 1)
      }

      // Chamando o método do repository
      const systable = await this.SystablesRepository.searchSystable(searchParams);

      // Se não encontrar nada
      if (!systable || (Array.isArray(systable) && systable.length === 0)) {
        return res.status(404).json({ message: "Nenhum registro encontrado" });
      }

      return res.json(systable);
    
    } catch (error) {
      console.error("Erro no search:", error);
      next(error); // Passa o erro para o middleware de tratamento
    }
  }
  
  // /** GET Busca todos registros em Datasys para listar pelo Parametro : { ID ou nome, chkdb } */


  ///////////////////////////////

  /** GET Lista todos os registros de systable por nome */
  async searchByName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text  = req.query?.text as string;
      const systable = await this.SystablesRepository.searchName(text);
      return res.status(200).send({ success: true, systable });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de systable por chkdb */
  async searchByChkdb(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
      try {
        const text  = req.query?.text as string;
        const systable = await this.SystablesRepository.searchChkbd(text);
        return res.status(200).send({ success: true, systable });
      } catch (error) {
        next(error);
      }
    }


  /** GET Busca um registro de systable por nome */
  async findByNmSystable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nmsystable = req.query?.nome as string;
      if (!nmsystable) {
        return res.status(400).send({ success: false, message: 'nome systable parameter is required' });
      }
      const systable = await this.SystablesRepository.findSystableByNome(nmsystable);
      return res.status(200).send({ success: true, systable });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de systable por chkdb */
  async findAllChkdb(
    req: Request<{}, {}, {}, { chkdb: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { chkdb } = req.query;
      if (!chkdb) {
        return res.status(400).send({ success: false, message: 'Chkdb parameter is required' });
      }
      const systable = await this.SystablesRepository.findSystableAllChkdb(chkdb);
      return res.status(200).send({ success: true, systable });
    } catch (error) {
      next(error);
    }
  }

}


