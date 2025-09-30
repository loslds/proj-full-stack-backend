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

  /** 1 POST Cria Tabela  */
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
      return res
        .status(400)
        .send({ success: false, message: 'Invalid fornecedoresId' })
        .end();
      }
    try {
      const fornecedores = await this.fornecedoresRepository.updateFornecedores(fornecedoresId, req.body);
        return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 3 DELETE Remove um registro id */
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
      const deleted = await this.fornecedoresRepository.deleteFornecedores(fornecedoresId);
        return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  
  /** 4 GET Busca todos os registros de imagens */
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
      return res.status(400).send({ success: false, message: 'Invalid fornecedoresId' }).end();
    }
    try {
      const fornecedores = await this.fornecedoresRepository.findOneFornecedoresById(fornecedoresId);
      return res.status(200).send({ success: true, fornecedores });
    } catch (error) {
      next(error);
    }
  }
  
  /** 6 GET Busca um registro de Empresas por Nome */
  async findOneFornecedoresNome(
    req: Request<{}, {}, {}, Partial<{ name: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: 'Nome parameter is required' })
        .end();
    }
    try {
      const fornecedores = await this.fornecedoresRepository.findOneFornecedoresByNome(name);
      return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 7 GET Busca um registro por Nome Fantasia  */
  async findOneFornecedoresFantasy(
    req: Request<{}, {}, {}, Partial<{ fantasy: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { fantasy } = req.query;
    if (!fantasy) {
      return res
        .status(400).send({ success: false, message: 'Fantasy parameter is required' }).end();
    }
    try {
      const fornecedores = await this.fornecedoresRepository.findOneFornecedoresByFantasy(fantasy);
      return res.status(200).send({ success: true, fornecedores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 8 pesquisaregistro através do ID ou NOME ou FANTASY */
  async searchFornecedores(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy } = req.query;
      const results = await this.fornecedoresRepository.searchAllFornecedores({
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

  
  /** 10 GET Busca todas as empresas com mesmo ID de imagens */
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
      console.error('Erro ao listar empresas:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

  // /** 12 Lista todas empresas com todos os detalhes */
  // async ListAllEmpresasByNomePessoaId(req: Request, res: Response) {

  //   try {
  //     const empresas = await this.empresasRepository.findAllEmpresasByNomeAndPessoaId());
  //     res.json({ success: true, data: empresas });
  //   } catch (err: any) {
  //     console.error('Erro ao listar empresas:', err);
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // }

  // /** 13 Lista todas empresas com todos os detalhes */
  // async ListAllEmpresasByNomeAndImagensId(req: Request, res: Response) {

  //   try {
  //     const empresas = await this.empresasRepository.listAllEmpresasDetails();
  //     res.json({ success: true, data: empresas });
  //   } catch (err: any) {
  //     console.error('Erro ao listar empresas:', err);
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // }

