import { NextFunction, Request, Response } from "express";
import { CidadesRepository } from './cidades.repository';
import { CidadesCreate, CidadesUpdate } from './cidades.dto';
import { CidadesEntity } from './cidades.entity';
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type CidadesDto = DeepPartial<CidadesEntity>;
import { HttpException } from "../../middlewares/HttpException";
import { ParsedQs } from 'qs';

export class CidadesController {  
  constructor(private readonly cidadesRepository: CidadesRepository) {}
  
/** 1 POST Cria Tabela Empresas */
async createNewCidades(
  req: Request<{}, {}, CidadesCreate>,
  res: Response,
  next: NextFunction
) {

  try {
    const cidades = await this.cidadesRepository.createCidades(req.body);
    return res.status(201).send({ success: true, cidades });

  } catch (error) {
    next(error);
  }

}

/** 2 PATCH Atualiza um registro de Empresas */
async updateIdCidades(
  req: Request<{ cidadesId: string }, {}, Partial<CidadesUpdate>>,
  res: Response,
  next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);
    if (isNaN(cidadesId) || cidadesId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid cidadesId' })
        .end();
      }
    try {
      const cidades = await this.cidadesRepository.updateCidades(cidadesId, req.body);
        return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 3 DELETE Remove um registro de Cidades */
  async removeCidadesId(
    req: Request<{ cidadesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);

    if (isNaN(cidadesId) || cidadesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid cidadesId' }).end();
    }

    try {
      const success = await this.cidadesRepository.deleteCidadesId(cidadesId);
      return res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  }

/** 4 GET Busca todos os registros  */
  async findAllCidades(
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<CidadesEntity> | undefined;
  
      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<CidadesEntity>;
      }
  
      const cidades = await this.cidadesRepository.findCidadesAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, cidades });
  
    } catch (error) {
        next(error);
    }    
  }
  
  /** 5 GET Lista um reg. Id  */
  async getOneIdCidades(
    req: Request<{ cidadesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cidadesId = Number(req.params.cidadesId);

    if (isNaN(cidadesId) || cidadesId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid cidadesId' }).end();
    }

    try {
      const cidades = await this.cidadesRepository.findOneCidadesById(cidadesId);
      return res.status(200).send({ success: true, cidades });
    } catch (error) {
      next(error);
    }
  }
  
  /** 6 GET Busca um registro por Nome */
  async findOneNomeCidades(
    req: Request<{}, {}, {}, Partial<{ name: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: 'Name parameter is required' })
        .end();
    }
    try {
      const cidades = await this.cidadesRepository.findOneCidadesByNome(name);
      return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 7 GET Busca um registro por Nome */
  async findOneCidadesBySigla(
    req: Request<{}, {}, {}, Partial<{ sigla: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: 'Sigla parameter is required' })
        .end();
    }
    try {
      const cidades = await this.cidadesRepository.findOneCidadesBySigla(name);
      return res.status(200).send({ success: true, cidades }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 8 pesquisa registro de Cidades ID ou NOME ou sigla */
  async searchByNomeOuEstadoPaginado(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, page, limit } = req.query;

      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 100;

      const { data, total } = await this.cidadesRepository.searchCidadesByNomeOuEstadoPaginado(
        nome ? (nome as string) : undefined,
        pageNum,
        limitNum
      );

      return res.json({
        success: true,
        total,
        page: pageNum,
        perPage: limitNum,
        data
      });
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      next(error);
    }
  }

  /** 9 Busca todas as cidades de um único estado (por ID ou nome/UF) */
  async findCidadesByEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const { estadoId, estadoNome, page, limit } = req.query;

      if (!estadoId && !estadoNome) {
        return res.status(400).json({
          success: false,
          message: 'É necessário informar estadoId ou estadoNome.'
        });
      }

      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 100;

      const { data, total } = await this.cidadesRepository.findCidadesByEstado(
        estadoId ? Number(estadoId) : undefined,
        estadoNome ? (estadoNome as string) : undefined,
        pageNum,
        limitNum
      );

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhuma cidade encontrada para este estado.'
        });
      }

      return res.json({
        success: true,
        total,
        page: pageNum,
        perPage: limitNum,
        data
      });
    
    } catch (error) {
      console.error('Erro ao buscar cidades por estado:', error);
      next(error);
    }
  }

}
