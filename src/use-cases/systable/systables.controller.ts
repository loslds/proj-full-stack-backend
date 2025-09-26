

// C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.controller.ts
import { NextFunction, Request, Response } from 'express';
import { SystablesCreate, SystablesUpdate } from './systables.dto';
import { SystablesRepository } from './systables.repository';
import { SystablesDto } from './systables.dto';
import { SystablesEntity } from './systables.entity';
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from 'typeorm';
import { HttpException } from '../../middlewares/HttpException';

export class SystablesController {
  constructor(private readonly systablesRepository: SystablesRepository) {}
  
  /** POST Cria um novo registro de systables */
  async createSystables(
    req: Request<{}, {}, SystablesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, chkdb, numberregs } = req.body;
      
      const exists = await this.systablesRepository.hasDuplicated(nome, chkdb, numberregs);
      if (exists) throw new HttpException(400, "systables já existe");
  
      const systables = await this.systablesRepository.createSystables(req.body);
      return res.status(201).send({ success: true, systables });

    } catch (error) {
      next(error);
    }
  }
  
  /** PATCH Atualiza um registro de systables */
async updateIdSystables(
  req: Request<{ systablesId: string }, {}, SystablesUpdate>,
  res: Response,
  next: NextFunction
) {
  try {
    const systablesId = Number(req.params?.systablesId);
    if (!systablesId) {
      throw new HttpException(400, "ID da systables inválido");
    }

    const { nome, ...rest } = req.body;

    // Verifica se já existe outro registro com o mesmo nome e ID diferente
    if (nome) {
      const exists = await this.systablesRepository.findOneNomeSystables(nome);
      if (exists && exists.id !== systablesId) {
        throw new HttpException(400, "Já existe uma tabela com esse nome");
      }
    }

    // Atualiza os dados (sem permitir mudar o ID)
    const systables = await this.systablesRepository.updateSystables(
      systablesId,
      { nome, ...rest }
    );

    return res.status(200).send({ success: true, systables });
  } catch (error) {
    next(error);
  }
}

//   /** DELETE Remove um registro de systables */
async removeIdSystables(
  req: Request<{ systablesId: string }>,
  res: Response,
  next: NextFunction
) {
  const systablesId = Number(req.params.systablesId);
  if (isNaN(systablesId) || systablesId <= 0) {
    return res.status(400) .send({ success: false, message: "ID inválido" });
  }
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


/** GET Busca todos os registros de systables */
async findAllSystables(req: Request, res: Response, next: NextFunction) {
  try {
    const { ativo } = req.query;
    let where: FindOptionsWhere<SystablesEntity> | undefined;
  
    if (ativo !== undefined) {
      where = { ativo: ativo === "true" } as FindOptionsWhere<SystablesEntity>;
    }
  
    const systables = await this.systablesRepository.findSystablesAll(where, { nome: "ASC" });
    return res.status(200).send({ success: true, systables });
  } catch (error) {
    next(error);
  }
}

//   /** GET Busca um registro de systables por ID */
async getOneSystables(req: Request<{ systablesId: string }>, res: Response, next: NextFunction) {
  try {
    const systablesId = Number(req.params.systablesId<SystablesDto>);
    if (isNaN(systablesId) || systablesId <= 0) {
      return res.status(400).send({ success: false, message: "ID inválido" });
    }

    const systables = await this.systablesRepository.findSystablesById(systablesId);
    return res.status(200).send({ success: true, systables });

  } catch (error) {
    next(error);
  }
}


/** GET Busca registros de systables por ID/nome/chkdb/numberregs (query) */
async searchSystables(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, nome, chkdb, numberregs } = req.query;

    const systables = await this.systablesRepository.searchSystables({
      id: id !== undefined ? Number(id) : undefined,
      nome: nome !== undefined ? String(nome) : undefined,
      chkdb: chkdb !== undefined ? (chkdb === 'true' ? 1 : 0) : undefined, // converte string "true" para 1, "false" para 0
      numberregs: numberregs !== undefined ? Number(numberregs) : undefined,
    });

    return res.status(200).send({ success: true, systables });
  } catch (error) {
    next(error);
  }
}

/** GET pesquisa Buscar por nome em systables */
async searchByNameSystables(req: Request, res: Response, next: NextFunction) {
  try {
    const text = req.query?.text as string;
    const systables = await this.systablesRepository.searchNameSystables(text);
    return res.status(200).send({ success: true, systables });
  } catch (error) {
    next(error);
  }
}

/** GET pesquisa Buscar por chkdb em systables */
async searchByChkdbSystables(req: Request, res: Response, next: NextFunction) {
  try {
    const text = req.query?.text as string;
    const systables = await this.systablesRepository.searchChkdbSystables(text);
    return res.status(200).send({ success: true, systables });
  } catch (error) {
    next(error);
  }
}

/** GET pesquisa Buscar por numberregs em systables */
async searchByNumberregsSystables(req: Request, res: Response, next: NextFunction) {
  try {
    const text = req.query?.text as string;
    const systables = await this.systablesRepository.searchNumberregsSystables(text);
    return res.status(200).send({ success: true, systables });
  } catch (error) {
    next(error);
  }
}


/** GET Lista um reg. nome em systable */
  async findOneNomeSystables(
    req: Request<{}, {}, {}, Partial<{ nome: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).send({ success: false, message: 'Name em tabela systable em parameter is required' })
        .end();
    }

    try {
      const systables = await this.systablesRepository.findOneNomeSystables(nome);
      return res.status(200).send({ success: true, systables }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os id e nome de systables */
  async findListByNomeSystables(req: Request, res: Response, next: NextFunction) {
    try {
      const nomes = await this.systablesRepository.findListNomeSystables();
      return res.status(200).send({ success: true, nomes });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os id, nome e chkdb de systables, com filtro opcional por chkdb */
  async findListNomeByChkdbSystables(req: Request, res: Response, next: NextFunction) {
    try {
      const { chkdb } = req.query;

      const lista = await this.systablesRepository.findListNomeChkdbSystables(
        chkdb !== undefined ? (chkdb === 'true' ? 1 : 0) : undefined
      );

      return res.status(200).send({ success: true, lista });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os id, nome, chkdb e numberregs de systables, com filtro opcional por numberregs */
  async findListNomeByNumberregsSystables(req: Request, res: Response, next: NextFunction) {
    try {
      const { numberregs } = req.query;

      const lista = await this.systablesRepository.findListNomeNumberregsSystables(
        numberregs !== undefined ? Number(numberregs) : undefined
      );

      return res.status(200).send({ success: true, lista });
    } catch (error) {
      next(error);
    }
  }
}

