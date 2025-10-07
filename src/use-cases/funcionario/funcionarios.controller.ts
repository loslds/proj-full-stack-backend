//


import { NextFunction, Request, Response } from "express";
import { FuncionariosRepository } from "./funcionarios.repository";
import { FuncionariosCreate, FuncionariosUpdate } from './funcionarios.dto';
import { FuncionariosEntity } from "./funcionarios.entity";
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type FuncionariosDto = DeepPartial<FuncionariosEntity>;
import { HttpException } from "../../middlewares/HttpException";
import { ParsedQs } from 'qs';

// Tipagem para query string da rota /search
interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}

export class FuncionariosController {  
  constructor(private readonly funcionariosRepository: FuncionariosRepository) {}

  /** 1 POST Cria reg  */
  async createNewFuncionarios(
    req: Request<{}, {}, FuncionariosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const funcionarios = await this.funcionariosRepository.createFuncionarios(req.body);
      return res.status(201).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** 2 PATCH Atualiza um registro  */
  async updateIdFuncionarios(
    req: Request<{ funcionariosId: string }, {}, Partial<FuncionariosUpdate>>,
    res: Response,
    next: NextFunction
    ) {
    const funcionariosId = Number(req.params.funcionariosId);
    if (isNaN(funcionariosId) || funcionariosId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid funcionariosId' }).end();
      }
    try {
      const funcionarios = await this.funcionariosRepository.updateFuncionariosId(funcionariosId, req.body);
        return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

  /** 3 DELETE Remove um registro  */
  async removeIdFuncionarios(
    req: Request<{ funcionariosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const funcionariosId = Number(req.params.funcionariosId);
    if (isNaN(funcionariosId) || funcionariosId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid funcionariosId' }).end();
    }
    try {
      const success = await this.funcionariosRepository.deleteFuncionariosId(funcionariosId);
      return res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  }

  
  /** 4 GET Busca todos os registros */
  async findAllFuncionarios(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<FuncionariosEntity> | undefined;
  
      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<FuncionariosEntity>;
      }
  
      const funcionarios = await this.funcionariosRepository.findFuncionariosAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, funcionarios });
  
    } catch (error) {
        next(error);
    }    
  }
  
  /** 5 GET Busca um registro por ID */
  async getOneFuncionariosId(
    req: Request<{ funcionariosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const funcionariosId = Number(req.params.funcionariosId);
    if (isNaN(funcionariosId) || funcionariosId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clientesId' }).end();
    }
    try {
      const funcionarios = await this.funcionariosRepository.findOneFuncionariosById(funcionariosId);
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }
  
  /** 6 GET Busca um registro por Nome */
  async findOneFuncionariosNome(
    req: Request<{}, {}, {}, Partial<{ nome: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nome } = req.query;
    if (!nome) {
      return res.status(400).send({ success: false, message: 'Nome parameter is required' }).end();
    }
    try {
      const funcionarios = await this.funcionariosRepository.findOneFuncionariosByNome(nome);
      return res.status(200).send({ success: true, funcionarios }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 7 GET Busca um registro por Fantasia  */
  async findOneFuncionariosFantasy(
    req: Request<{}, {}, {}, Partial<{ fantasy: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { fantasy } = req.query;
    if (!fantasy) {
      return res.status(400).send({ success: false, message: 'Fantasy parameter is required' }).end();
    }
    try {
      const funcionarios = await this.funcionariosRepository.findOneFuncionariosByFantasy(fantasy);
      return res.status(200).send({ success: true, funcionarios }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 8 pesquisa registro através do ID ou NOME ou FANTASY */
  async searchByFuncionarios(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy } = req.query;
      const results = await this.funcionariosRepository.searchFuncionarios({
        id: id ? Number(id) : undefined,
        nome,
        fantasy,
      });
      return res.json(results);
    } catch (error) {
      next(error);
    }
  }

  /** 9 GET todos os reg. com id_pessoas */
  async findAllFuncionariosPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoasId = Number(req.params.pessoasId);
    if (isNaN(pessoasId) || pessoasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoasId' }).end();
    }

    try {
      const funcionarios = await this.funcionariosRepository.findAllFuncionariosByPessoasId(pessoasId);
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }
  
  /** 10 GET todos os reg, mesmo ID de imagens */
  async findAllFuncionariosImagensId(
    req: Request<{ imagensId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const imagensId = Number(req.params.imagensId);
    if (isNaN(imagensId) || imagensId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid imagensId' }).end();
    }

    try {
      const funcionarios = await this.funcionariosRepository.findAllFuncionariosByImagensId(imagensId);
      return res.status(200).send({ success: true, funcionarios });
    } catch (error) {
      next(error);
    }
  }

    /** 11 Lista todas empresas com todos os detalhes */
  async findAllFuncionariosByDetails(req: Request, res: Response) {

    try {
      const funcionarios = await this.funcionariosRepository.listAllFuncionariosDetails();
      res.json({ success: true, data: funcionarios });
      
    } catch (err: any) {
      console.error('Erro ao listar funcionarios:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

  
