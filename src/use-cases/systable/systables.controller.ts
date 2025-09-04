import { NextFunction, Request, Response } from 'express';
import { SystablesCreate, SystablesUpdate } from './systables.dto';
import { SystablesRepository } from './systables.repository';
import { SystablesDto } from './systables.dto';
import { SystablesEntity } from './systables.entity';
import { DeepPartial } from 'typeorm';
import { HttpException } from '../../middlewares/HttpException';

export class SystablesController {
  constructor(private readonly systablesRepository: SystablesRepository) {}

/** POST Cria um novo registro de systables */
  async create(
    req: Request<{}, {}, SystablesCreate>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { nome, chkdb, numberregs} = body
    try {
      const exists = await this.systablesRepository.hasDuplicated(nome, chkdb, numberregs)
      if(!!exists) throw new HttpException(400,'systables ja existe')

      const systables = await this.systablesRepository.createSystable(body);
      return res.status(201).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de systables */
  async update(
    req: Request<{ systablesId: string }, {}, SystablesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const { params, body } = req
    const { nome, chkdb, numberregs} = body
    try {
      const systablesId = Number(params?.systablesId);
      if(!systablesId) throw new HttpException(400,'id systables invalido')
      
      const exists = await this.systablesRepository.hasDuplicated(nome, chkdb, numberregs, [systablesId])
      if(!!exists) throw  new HttpException(400,'systables ja existe')

      const systables = await this.systablesRepository.updateSystable(
        systablesId,
        body 
      );

      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de systables */
  async remove(
    req: Request<{ systablesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const systablesId = Number(req.params.systablesId);
    if (isNaN(systablesId) || systablesId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid systablesId' })
        .end();
    }
    try {
      await this.systablesRepository.deleteSystable(systablesId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de systables */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const systables = await this.systablesRepository.findSystableAll();
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de systables por ID */
  async getOne(
    req: Request<{ systablesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const systablesId = Number(req.params.systablesId);

    if (isNaN(systablesId) || systablesId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid systablesId' })
        .end();
    }

    try {
      const systables = await this.systablesRepository.findSystableById(systablesId);
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      // Extraindo parâmetros opcionais da query
      const { id, nome, chkdb, numberregs } = req.query;

      // Convertendo 'id' para número, caso seja enviado
      const searchParams = {
        id: id ? Number(id) : undefined,
        nome: nome as string,
        chkdb: chkdb ? Number(numberregs) : undefined,
        numberregs: numberregs ? Number(numberregs) : undefined,
      };
      


      // Chamando o método do repository
      const systables = await this.systablesRepository.searchSystable(searchParams);
      return res.json(systables);
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento
    }
    
  }

  ///////////////////////////////

  // /** GET Busca um registro de systable pelo Parametro : { ID ou nome, chkdb } */
  // async search(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     // Extraindo parâmetros opcionais da query
  //     const { id, nome, chkdb, numberregs } = req.query;

  //     // Normalizando os parâmetros
  //     const searchParams: {
  //       id?: number;
  //       nome?: string;
  //       chkdb?: number;
  //       numberregs?: number;
  //     } = {};

  //     if (id && !isNaN(Number(id))) {
  //       searchParams.id = Number(id);
  //     }

  //     if (nome && typeof nome === "string") {
  //       searchParams.nome = nome;
  //     }

  //     if (chkdb !== undefined) {
  //       searchParams.chkdb = Number(chkdb) === 1 ? 1 : 0; // força tinyint (0 ou 1)
  //     }

  //     // Chamando o método do repository
  //     const systables = await this.SystablesRepository.searchSystable(searchParams);

  //     // Se não encontrar nada
  //     if (!systables || (Array.isArray(systables) && systables.length === 0)) {
  //       return res.status(404).json({ message: "Nenhum registro encontrado" });
  //     }

  //     return res.json(systables);
    
  //   } catch (error) {
  //     console.error("Erro no search:", error);
  //     next(error); // Passa o erro para o middleware de tratamento
  //   }
  // }
  
  // // /** GET Busca todos registros em Datasys para listar pelo Parametro : { ID ou nome, chkdb } */


  // ///////////////////////////////

  // /** GET Lista todos os registros de systable por nome */
  // async searchByName(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const text  = req.query?.text as string;
  //     const systables = await this.SystablesRepository.searchName(text);
  //     return res.status(200).send({ success: true, systables });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // /** GET Lista todos os registros de systable por chkdb */
  // async searchByChkdb(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  //   ) {
  //     try {
  //       const text  = req.query?.text as string;
  //       const systables = await this.SystablesRepository.searchChkbd(text);
  //       return res.status(200).send({ success: true, systables });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }


  // /** GET Busca um registro de systable por nome */
  // async findByNmSystable(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const nome = req.query?.nome as string;
  //     if (!nome) {
  //       return res.status(400).send({ success: false, message: 'nome systables parameter is required' });
  //     }
  //     const systables = await this.SystablesRepository.findSystableByNome(nome);
  //     return res.status(200).send({ success: true, systables });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // /** GET Lista todos os registros de systable por chkdb */
  // async findAllChkdb(
  //   req: Request<{}, {}, {}, { chkdb: number }>,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { chkdb } = req.query;
  //     if (!chkdb) {
  //       return res.status(400).send({ success: false, message: 'Chkdb parameter is required' });
  //     }
  //     const systables = await this.SystablesRepository.findSystableAllChkdb(chkdb);
  //     return res.status(200).send({ success: true, systables });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

}


