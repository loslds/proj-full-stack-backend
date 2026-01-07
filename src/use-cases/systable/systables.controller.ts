 
//C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.controller.ts
import { NextFunction, Request, Response } from 'express';
import { SystablesCreate, SystablesUpdate } from './systables.dto';
import { SystablesRepository } from './systables.repository';
import { HttpException } from '../../exceptions/HttpException';

export class SystablesController {
  constructor(private readonly systablesRepository: SystablesRepository) {}

  /** POST Cria um novo registro de systables */
  async createBySysTables(
    req: Request<{}, {}, SystablesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, chkdb, numberregs } = req.body;

      const exists = await this.systablesRepository.hasDuplicatedBySystables(nome, chkdb, numberregs);
      if (exists) throw new HttpException(400, "systables já existe");

      const systables = await this.systablesRepository.createSystables(req.body);
      return res.status(201).send({ success: true, systables });

    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de systables */
  async updateIdSysTables(
    req: Request<{ systablesId: string }, {}, SystablesUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const systablesId = Number(req.params.systablesId);
      if (!systablesId) {
        throw new HttpException(400, "ID da systables inválido");
      }

      const { nome, ...rest } = req.body;

      if (nome) {
        const exists = await this.systablesRepository.findOneNomeSystables(nome);
        if (exists && exists.id !== systablesId) {
          throw new HttpException(400, "Já existe uma tabela com esse nome");
        }
      }

      const systables = await this.systablesRepository.updateSystables(
        systablesId,
        { nome, ...rest }
      );

      return res.status(200).send({ success: true, systables });

    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de systables */
  async removeIdSysTables(
    req: Request<{ systablesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const systablesId = Number(req.params.systablesId);
      if (isNaN(systablesId) || systablesId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }

      await this.systablesRepository.deleteSystables(systablesId);
      return res.status(200).send({ success: true });

    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros */
  async findAllSysTables(req: Request, res: Response, next: NextFunction) {
    try {
      const systables = await this.systablesRepository.findAllSystables({}, { nome: "ASC" });
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro por ID */
  async getOneSysTablesId(
    req: Request<{ systablesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const systablesId = Number(req.params.systablesId);
      if (isNaN(systablesId) || systablesId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }

      const systables = await this.systablesRepository.findOneIdSystables(systablesId);
      return res.status(200).send({ success: true, systables });

    } catch (error) {
      next(error);
    }
  }

  /////////////////////////////////////
  // pesquisas por qualquer campo da Tabela
  ///////////////////////////////////// 
    
  /** GET Busca por múltiplos campos (query) */
  async searchSysTables(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nome, chkdb, numberregs } = req.query;

      const systables = await this.systablesRepository.searchSystables({
        id: id ? Number(id) : undefined,
        nome: nome ? String(nome) : undefined,
        chkdb: chkdb ? (chkdb === "true" ? 1 : 0) : undefined,
        numberregs: numberregs ? Number(numberregs) : undefined
      });

      return res.status(200).send({ success: true, systables });

    } catch (error) {
      next(error);
    }
  }

  /////////////////////////////////////
  // pesquisas Rapidas atraves do Campo
  /////////////////////////////////////

  /** Busca por nome */
  async searchSysTablesByNome(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query?.text as string;
      const systables = await this.systablesRepository.searchNomeSystables(text);
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  /** GET - pesquisa por chkdb (rápida) */
  async searchSysTablesByChkdb(req: Request, res: Response, next: NextFunction) {
    try {
      // Pode vir ?chkdb=1 ou ?chkdb=true ou ?text=...
      // Se você usa query param 'chkdb' então use esse:
      const chkdbRaw = (req.query?.chkdb ?? req.query?.text) as string | undefined;

      if (chkdbRaw === undefined) {
        // retorna todos com limite implementado no repo
        const systables = await this.systablesRepository.searchChkdbSystables(undefined);
        return res.status(200).send({ success: true, systables });
      }

      const v = String(chkdbRaw).toLowerCase();
      const parsed = (v === 'true' || v === '1') ? 1
                   : (v === 'false' || v === '0') ? 0
                   : Number(chkdbRaw);

      if (isNaN(Number(parsed))) {
        return res.status(400).send({ success: false, message: 'Parâmetro chkdb inválido' });
      }

      const systables = await this.systablesRepository.searchChkdbSystables(Number(parsed));
      return res.status(200).send({ success: true, systables });
      }   
    catch (error) {
      next(error);
    }
  }

  /** GET - pesquisa por numberregs (rápida) */
  async searchSysTablesByNumberregs(req: Request, res: Response, next: NextFunction) {
    try {
        const numRaw = (req.query?.numberregs ?? req.query?.text) as string | undefined;

        if (numRaw === undefined) {
          const systables = await this.systablesRepository.searchNumberregsSystables(undefined);
          return res.status(200).send({ success: true, systables });
        }

        const parsed = Number(numRaw);
        if (isNaN(parsed)) {
          return res.status(400).send({ success: false, message: 'Parâmetro numberregs inválido' });
        }

        const systables = await this.systablesRepository.searchNumberregsSystables(parsed);
        return res.status(200).send({ success: true, systables });
      } 
    catch (error) {
      next(error);
    }
  }

  /////////////////////////////////////
  // Listagens
  /////////////////////////////////////

  /** Lista todos os nomes */
  async findOneSysTablesByNome(req: Request, res: Response, next: NextFunction) {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).send({ success: false, message: 'Nome é obrigatório' });
    }

    try {
      const systables = await this.systablesRepository.findOneNomeSystables(nome as string);
      return res.status(200).send({ success: true, systables });
    } catch (error) {
      next(error);
    }
  }

  async ListSysTablesByNome(req: Request, res: Response, next: NextFunction) {
    try {
      const nomes = await this.systablesRepository.listNomeSystables();
      return res.status(200).send({ success: true, nomes });
    } catch (error) {
      next(error);
    }
  }

  async ListSysTablesChkdb(req: Request, res: Response, next: NextFunction) {
    try {
      const { chkdb } = req.query;

      const lista = await this.systablesRepository.listChkdbSystables(
        chkdb !== undefined ? (chkdb === "true" ? 1 : 0) : undefined
      );

      return res.status(200).send({ success: true, lista });
    } catch (error) {
      next(error);
    }
  }

  async ListSysTablesNumberregs(req: Request, res: Response, next: NextFunction) {
    try {
      const { numberregs } = req.query;

      const lista = await this.systablesRepository.listNumberregsSystables(
        numberregs !== undefined ? Number(numberregs) : undefined
      );

      return res.status(200).send({ success: true, lista });
    } catch (error) {
      next(error);
    }
  }
}

