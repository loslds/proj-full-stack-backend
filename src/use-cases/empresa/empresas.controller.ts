import { NextFunction, Request, Response } from "express";
import { EmpresasRepository } from "./empresas.repository";
import { EmpresasCreate, EmpresasUpdate } from './empresas.dto';
import { EmpresasEntity } from './empresas.entity';
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type EmpresasDto = DeepPartial<EmpresasEntity>;
import { HttpException } from "../../middlewares/HttpException";
import { ParsedQs } from 'qs';

// Tipagem para query string da rota /search
interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}

export class EmpresasController {  
  constructor(private readonly empresasRepository: EmpresasRepository) {}

  /** 1 POST Cria Tabela Empresas */
  async createNewEmpresas(
    req: Request<{}, {}, EmpresasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresas = await this.empresasRepository.createEmpresas(req.body);
      return res.status(201).send({ success: true, empresas }).end();
    } catch (error) {
      next(error);
    }
  }


  /** 2 PATCH Atualiza um registro de Empresas */
  async updateIdEmpresas(
    req: Request<{ empresasId: string }, {}, Partial<EmpresasUpdate>>,
    res: Response,
    next: NextFunction
    ) {
    const empresasId = Number(req.params.empresasId);
    if (isNaN(empresasId) || empresasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresasId' }).end();
      }
    try {
      const empresas = await this.empresasRepository.updateEmpresas(empresasId, req.body);
        return res.status(200).send({ success: true, empresas }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 3 DELETE Remove um registro ID */
  async removeIdEmpresas(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresasId = Number(req.params.empresasId);

    if (isNaN(empresasId) || empresasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresasId' }).end();
    }

    try {
      const success = await this.empresasRepository.deleteEmpresasId(empresasId);
      return res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  }

  
  /** 4 GET Busca todos os registros */
  async findAllEmpresas(
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<EmpresasEntity> | undefined;
  
      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<EmpresasEntity>;
      }
  
      const empresas = await this.empresasRepository.findEmpresasAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, empresas });
  
    } catch (error) {
        next(error);
    }    
  }
  
  /** 5 GET Busca um registro de Empresas por ID */
  async getOneEmpresasId(
    req: Request<{ empresasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresasId = Number(req.params.empresasId);
    if (isNaN(empresasId) || empresasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresasId' }).end();
    }
    try {
      const empresas = await this.empresasRepository.findOneEmpresasById(empresasId);
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }
  
  /** 6 GET Busca um registro de Empresas por Nome */
  async findOneEmpresasNome(
    req: Request<{}, {}, {}, Partial<{ nome: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nome } = req.query;
    if (!nome) {
      return res.status(400).send({ success: false, message: 'Nome parameter is required' }).end();
    }
    try {
      const empresas = await this.empresasRepository.findOneEmpresasByNome(nome);
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }

  /** 7 GET Busca um registro de Empresas por Nome Fantasia  */
  async findOneEmpresasFantasy(
    req: Request<{}, {}, {}, Partial<{ fantasy: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { fantasy } = req.query;
    if (!fantasy) {
      return res.status(400).send({ success: false, message: 'Fantasy parameter is required' }).end();
    }
    try {
      const empresas = await this.empresasRepository.findOneEmpresasByFantasy(fantasy);
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }

  /** 8 pesquisaregistro de Empresas através do ID ou NOME ou FANTASY */
  async searchByEmpresas(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy } = req.query;
      const results = await this.empresasRepository.searchEmpresas({
        id: id ? Number(id) : undefined,
        nome,
        fantasy,
      });
      return res.json(results);
    } catch (error) {
      next(error);
    }
  }

  /** 9 GET todos refistros com id_pessoas em empresa */
  async findAllEmpresasPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoasId = Number(req.params.pessoasId);
    if (isNaN(pessoasId) || pessoasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoasId' }).end();
    }

    try {
      const empresas = await this.empresasRepository.findAllEmpresasByPessoasId(pessoasId);
      return res.status(200).send({ success: true, empresas });
    } catch (error) {
      next(error);
    }
  }

/** 10 GET - Lista detalhes das empresas */
  async findAllEmpresasDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const empresas = await this.empresasRepository.listAllEmpresasDetails();

      return res.status(200).json({
        success: true,
        data: empresas,
      });

    } catch (err: any) {
      console.error('Erro ao listar empresas:', err);
    
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar empresas',
        error: err.message,
      });
    }
  }
}


