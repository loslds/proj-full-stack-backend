
// C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.controller.ts
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

  /** GET Pesquisa registros de systables por nome */
  async searchByName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text  = req.query?.text as string;
      const systalbes = await this.systablesRepository.searchName(text);
      return res.status(200).send({ success: true, systalbes });
    } catch (error) {
      next(error);
    }
  } 

  /** GGET Pesquisa registros de systables por chkdb */
  async searchByChkdb(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text  = req.query?.text as string;
      const systables = await this.systablesRepository.searchChkbd(text);
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de systables por nome */
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
      const systables = await this.systablesRepository.findOneNomeSystable(nome);
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de systables por nome */
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
    const systables = await this.systablesRepository.findAllNomeSystables(nome);
    if (systables.length === 0) {
      return res.status(404).send({ success: false, message: "Nenhuma systables encontrada com esse nome" });
    }
    return res.status(200).send({ success: true, systables });
  } catch (error) {
    next(error);
    }
  } 

  
  /** GET Busca todos os registros de systables por chkdb */
  async findAllChkdb(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
      const chkdbStr = req.query?.chkdb as string;
      if (!chkdbStr) {
        return res.status(400).send({ success: false, message: "chkdb parameter is required" });
      }
      const chkdb = Number(chkdbStr);
      if (isNaN(chkdb)) {
        return res.status(400).send({ success: false, message: "chkdb must be a number" });
      }
      const systables = await this.systablesRepository.findAllChkdbSystables(chkdb);
      if (systables.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma systables encontrada com esse chkdb" });
      }
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de systables por numberregs */
  async findAllNumberregs(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
      const numberregsStr = req.query?.numberregs as string;
      if (!numberregsStr) {
        return res.status(400).send({ success: false, message: "numberregs parameter is required" });
      }
      const numberregs = Number(numberregsStr);
      if (isNaN(numberregs)) {
        return res.status(400).send({ success: false, message: "numberregs must be a number" });
      }
      const systables = await this.systablesRepository.findAllNumberRegSystables(numberregs);
      if (systables.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma systables encontrada com esse numberregs" });
      }
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }
}



