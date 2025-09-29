//

import { NextFunction, Request, Response } from "express";
import { ConsumidoresRepository } from "./consumidores.repository";
import { ConsumidoresCreate, ConsumidoresUpdate } from './consumidores.dto';
import { ConsumidoresEntity } from "./consumidores.entity";
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type ConsumidoresDto = DeepPartial<ConsumidoresEntity>;
import { HttpException } from "../../middlewares/HttpException";
import { ParsedQs } from 'qs';

// Tipagem para query string da rota /search
interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}

export class ConsumidoresController {  
  constructor(private readonly consumidoresRepository: ConsumidoresRepository) {}

  /** 1 POST Cria Tabela consumidores */
  async createNewConsumidores(
    req: Request<{}, {}, ConsumidoresCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consumidores = await this.consumidoresRepository.createConsumidores(req.body);
      return res.status(201).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }
  /** 2 PATCH Atualiza um registro de consumidores */
  async updateIdConsumidores(
    req: Request<{ consumidoresId: string }, {}, Partial<ConsumidoresUpdate>>,
    res: Response,
    next: NextFunction
    ) {
    const consumidoresId = Number(req.params.consumidoresId);
    if (isNaN(consumidoresId) || consumidoresId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid consumidoresId' })
        .end();
      }
    try {
      const consumidores = await this.consumidoresRepository.updateConsumidores(consumidoresId, req.body);
        return res.status(200).send({ success: true, consumidores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 3 DELETE Remove um registro de Empresas */
  async removeIdConsumidores(
    req: Request<{ consumidoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const consumidoresId = Number(req.params.consumidoresId);
    if (isNaN(consumidoresId) || consumidoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid consumidoresId' }).end();
    }
    try {
      const deleted = await this.consumidoresRepository.deleteConsumidores(consumidoresId);
        return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  
  /** 4 GET Busca todos os registros de imagens */
  async findAllConsumidores(req: Request, res: Response, next: NextFunction) {
    
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<ConsumidoresEntity> | undefined;
  
      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<ConsumidoresEntity>;
      }
  
      const consumidores = await this.consumidoresRepository.findConsumidoresAll(where, { nome: "ASC" });
      return res.status(200).send({ success: true, consumidores });
  
    } catch (error) {
        next(error);
    }    
  }
  
  /** 5 GET Busca um registro de Empresas por ID */
  async getOneConsumidoresId(
    req: Request<{ consumidoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const consumidoresId = Number(req.params.consumidoresId);
    if (isNaN(consumidoresId) || consumidoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid consumidoresId' }).end();
    }
    try {
      const consumidores = await this.consumidoresRepository.findOneConsumidoresById(consumidoresId);
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }
  
  /** 6 GET Busca um registro de Empresas por Nome */
  async findOneConsumidoresNome(
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
      const consumidores = await this.consumidoresRepository.findOneConsumidoresByNome(name);
      return res.status(200).send({ success: true, consumidores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 7 GET Busca um registro de consumidores por Nome Fantasia  */
  async findOneConsumidoresFantasy(
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
      const consumidores = await this.consumidoresRepository.findOneConsumidoresByFantasy(fantasy);
      return res.status(200).send({ success: true, consumidores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** 8 pesquisaregistro de Empresas através do ID ou NOME ou FANTASY */
  async searchConsumidores(req: Request<{}, {}, {}, SearchQuery>, res: Response, next: NextFunction) {
    try {
      const { id, nome, fantasy } = req.query;
      const results = await this.consumidoresRepository.searchConsumidores({
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
  async findAllConsumidoresPessoasId(
    req: Request<{ pessoasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoasId = Number(req.params.pessoaId);
    if (isNaN(pessoasId) || pessoasId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoasId' }).end();
    }

    try {
      const consumidores = await this.consumidoresRepository.findAllConsumidoresByPessoasId(pessoasId);
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }

  
  /** 10 GET Busca todas as empresas com mesmo ID de imagens */
  async findAllConsumidoresImagensId(
    req: Request<{ imagensId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const imagensId = Number(req.params.imagensId);
    if (isNaN(imagensId) || imagensId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid imagensId' }).end();
    }

    try {
      const consumidores = await this.consumidoresRepository.findAllConsumidoresByImagensId(imagensId);
      return res.status(200).send({ success: true, consumidores });
    } catch (error) {
      next(error);
    }
  }

    /** 11 Lista todas empresas com todos os detalhes */
  async findAllConsumidoresByDetails(req: Request, res: Response) {

    try {
      const consumidores = await this.consumidoresRepository.listAllConsumidoresDetails();
      res.json({ success: true, data: consumidores });
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

