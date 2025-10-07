//

import { NextFunction, Request, Response } from "express";
import { FornecedoresRepository } from "./fornecedores.repository";
import { FornecedoresCreate, FornecedoresUpdate } from './fornecedores.dto';
import { FornecedoresEntity } from "./fornecedores.entity";
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type FornecedoresDto = DeepPartial<FornecedoresEntity>;
import { HttpException } from "../../middlewares/HttpException";
import { ParsedQs } from 'qs';

// Tipagem para query string da rota /search
interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}

export class FornecedoresController {  
  constructor(private readonly fornecedoresRepository: FornecedoresRepository) {}

  /** 1 POST Cria reg  */
  async createNewFornecedores(
    req: Request<{}, {}, FornecedoresCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fornecedores = await this.fornecedoresRepository.createFornecedores(req.body);
      return res.status(201).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }

  /** 2 PATCH Atualiza um registro  */
  async updateIdFornecedores(
    req: Request<{ fornecedoresId: string }, {}, Partial<FornecedoresUpdate>>,
    res: Response,
    next: NextFunction
    ) {
    const fornecedoresId = Number(req.params.fornecedoresId);
    if (isNaN(fornecedoresId) || fornecedoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid fornecedoresId' }).end();
      }
    try {
      const fornecedores = await this.fornecedoresRepository.updateFornecedoresId(fornecedoresId, req.body);
        return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }

  /** 3 DELETE Remove um registro  */
  async removeIdFornecedores(
    req: Request<{ fornecedoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedoresId = Number(req.params.fornecedoresId);
    if (isNaN(fornecedoresId) || fornecedoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid fornecedoresId' }).end();
    }
    try {
      const success = await this.fornecedoresRepository.deleteFornecedoresId(fornecedoresId);
      return res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  }

  
  /** 4 GET Busca todos os registros */
  async findAllFornecedores(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<FornecedoresEntity> | undefined;
  
      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<FornecedoresEntity>;
      }
  
      const fornecedores = await this.fornecedoresRepository.findFornecedoresAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, fornecedores });
  
    } catch (error) {
        next(error);
    }    
  }
  
  /** 5 GET Busca um registro por ID */
  async getOneFornecedoresId(
    req: Request<{ fornecedoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedoresId = Number(req.params.fornecedoresId);
    if (isNaN(fornecedoresId) || fornecedoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid clientesId' }).end();
    }
    try {
      const fornecedores = await this.fornecedoresRepository.findOneFornecedoresById(fornecedoresId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }
  
  /** 6 GET Busca um registro por Nome */
  async findOneFornecedoresNome(
    req: Request<{}, {}, {}, Partial<{ nome: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { nome } = req.query;
    if (!nome) {
      return res.status(400).send({ success: false, message: 'Nome parameter is required' }).end();
    }
    try {
      const fornecedores = await this.fornecedoresRepository.findOneFornecedoresByNome(nome);
      return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 7 GET Busca um registro por Fantasia  */
  async findOneFornecedoresFantasy(
    req: Request<{}, {}, {}, Partial<{ fantasy: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { fantasy } = req.query;
    if (!fantasy) {
      return res.status(400).send({ success: false, message: 'Fantasy parameter is required' }).end();
    }
    try {
      const fornecedores = await this.fornecedoresRepository.findOneFornecedoresByFantasy(fantasy);
      return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 8 pesquisa registro através do ID ou NOME ou FANTASY */
  async searchByFornecedores(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy } = req.query;
      const results = await this.fornecedoresRepository.searchFornecedores({
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
  async findAllFornecedoresPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoasId = Number(req.params.pessoasId);
    if (isNaN(pessoasId) || pessoasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoasId' }).end();
    }

    try {
      const fornecedores = await this.fornecedoresRepository.findAllFornecedoresByPessoasId(pessoasId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }
  
  /** 10 GET todos os reg, mesmo ID de imagens */
  async findAllFornecedoresImagensId(
    req: Request<{ imagensId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const imagensId = Number(req.params.imagensId);
    if (isNaN(imagensId) || imagensId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid imagensId' }).end();
    }

    try {
      const fornecedores = await this.fornecedoresRepository.findAllFornecedoresByImagensId(imagensId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }

    /** 11 Lista todas empresas com todos os detalhes */
  async findAllFornecedoresByDetails(req: Request, res: Response) {

    try {
      const fornecedores = await this.fornecedoresRepository.listAllFornecedoresDetails();
      res.json({ success: true, data: fornecedores });
      
    } catch (err: any) {
      console.error('Erro ao listar fornecedores:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
