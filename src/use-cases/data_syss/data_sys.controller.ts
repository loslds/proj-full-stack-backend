import { NextFunction, Request, Response } from 'express';
import { Data_SysCreate, Data_SysUpdate } from './data_sys.dto';
import { Data_SysRepository } from './data_sys.repository';
import { Data_SysDto } from './data_sys.dto';
import { Data_SysEntity } from './data_sys.entity';
import { DeepPartial } from 'typeorm';
import { HttpException } from '../../services/HttpException';

export class Data_sysController {
  constructor(private readonly Data_SysRepository: Data_SysRepository) {}

/** POST Cria um novo registro de Data_sys */
  async create(
    req: Request<{}, {}, Data_SysCreate>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { nome, chkdb} = body
    try {
      const exists = await this.Data_SysRepository.hasDuplicated(nome, chkdb)
      if(!!exists) throw new HttpException(400,'data_sys ja existe')

      const datasys = await this.Data_SysRepository.createData_sys(body);
      return res.status(201).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Pessoa */
  async update(
    req: Request<{ datasysId: string }, {}, Data_SysUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const { params, body } = req
    const { nome, chkdb} = body
    try {
      const datasysId = Number(params?.datasysId);
      if(!datasysId) throw new HttpException(400,'Reg. id em Data_Sys invalido')
      
      const exists = await this.Data_SysRepository.hasDuplicated(nome, chkdb, [datasysId])
      if(!!exists) throw  new HttpException(400,'Reg. em Data_Sys ja existe')

      const datasys = await this.Data_SysRepository.updateData_sys(
        datasysId,
        body 
      );

      return res.status(200).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Pessoas */
  async remove(
    req: Request<{ datasysId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const datasysId = Number(req.params.datasysId);
    if (isNaN(datasysId) || datasysId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid datasysId' })
        .end();
    }

    try {
      await this.Data_SysRepository.deleteDatasys(datasysId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Datasys */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const datasys = await this.Data_SysRepository.findData_sysAll();
      return res.status(200).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Datasys por ID */
  async getOne(
    req: Request<{ datasysId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const datasysId = Number(req.params.datasysId);

    if (isNaN(datasysId) || datasysId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid DatasysId' })
        .end();
    }

    try {
      const datasys = await this.Data_SysRepository.findData_SysById(datasysId);
      return res.status(200).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }

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
    const datasys = await this.Data_SysRepository.searchData_sys(searchParams);

    // Se não encontrar nada
    if (!datasys || (Array.isArray(datasys) && datasys.length === 0)) {
      return res.status(404).json({ message: "Nenhum registro encontrado" });
    }

    return res.json(datasys);
  } catch (error) {
    console.error("Erro no search:", error);
    next(error); // Passa o erro para o middleware de tratamento
  }
}

  ///////////////////////////////

  /** GET Lista todos os registros de DataSys por nome */
  async searchByName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text  = req.query?.text as string;
      const datasys = await this.Data_SysRepository.searchName(text);
      return res.status(200).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }

/** GET Lista todos os registros de DataSys por chkdb */
  async searchByChkdb(
   req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text  = req.query?.text as string;
      const datasys = await this.Data_SysRepository.searchChkbd(text);
      return res.status(200).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }


  /** GET Busca um registro de DataSys por nome */
  async findByNmDatasys(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nmdatasys = req.query?.nome as string;
      if (!nmdatasys) {
        return res.status(400).send({ success: false, message: 'nome DataSys parameter is required' });
      }
      const datasys = await this.Data_SysRepository.findData_sysByNome(nmdatasys);
      return res.status(200).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Datasys por chkdb */
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
      const datasys = await this.Data_SysRepository.findDatasysAllChkdb(chkdb);
      return res.status(200).send({ success: true, datasys });
    } catch (error) {
      next(error);
    }
  }

}


