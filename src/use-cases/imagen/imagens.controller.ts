
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.controller.ts

import { NextFunction, Request, Response } from "express";
import { ImagensRepository } from "./imagens.repository";
import { ImagensCreate, ImagensUpdate } from "./imagens.dto";
import { ImagensEntity } from "./imagens.entity";
import { FindOptionsWhere } from "typeorm";
import { DeepPartial } from "typeorm";
export type ImagensDto = DeepPartial<ImagensEntity>;
import { HttpException } from "../../middlewares/HttpException";

export class ImagensController {
  constructor(private readonly imagensRepository: ImagensRepository) {}

  /** POST Cria um novo registro de imagens */
  async createNewImagens(req: Request, res: Response, next: NextFunction) {
  try {
    const data: ImagensCreate = req.body;
    const imagem = await this.imagensRepository.createImagens(data);
    return res.status(201).json({ success: true, imagem });
  } catch (err) {
      next(err);
    }
  }
  /** PATCH Atualiza um registro de imagens */
  async updateIdImagens(
    req: Request<{ imagensId: string }, {}, ImagensUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const imagensId = Number(req.params?.imagensId);
      if (!imagensId) throw new HttpException(400, "ID da imagens inválido");

      const { arqTipo, arqNome } = req.body;
      const exists = await this.imagensRepository.hasDuplicated(arqTipo, arqNome, [imagensId]);
      if (exists) throw new HttpException(400, "imagens já existe");

      const imagens = await this.imagensRepository.updateImagens(imagensId, req.body);
      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de imagens */
  async removeIdImagens(req: Request<{ imagensId: string }>, res: Response, next: NextFunction) {
    try {
      const imagensId = Number(req.params.imagensId);
      if (isNaN(imagensId) || imagensId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }
      await this.imagensRepository.deleteImagens(imagensId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de imagens */
  async findAllImagens(req: Request, res: Response, next: NextFunction) {
    try {
      const { ativo } = req.query;
      let where: FindOptionsWhere<ImagensEntity> | undefined;

      if (ativo !== undefined) {
        where = { ativo: ativo === "true" } as FindOptionsWhere<ImagensEntity>;
      }

      const imagens = await this.imagensRepository.findImagensAll(where, { arqNome: "ASC" });
      return res.status(200).send({ success: true, imagens });

    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Pessoas por ID */
  async getOneImagensId(req: Request<{ imagensId: string }>, res: Response, next: NextFunction) {
    try {
      const imagensId = Number(req.params.pessoasId);
      if (isNaN(imagensId) || imagensId <= 0) {
        return res.status(400).send({ success: false, message: "ID inválido" });
      }

      const imagens = await this.imagensRepository.findImagensById(imagensId);
      return res.status(200).send({ success: true, imagens });

    } catch (error) {
      next(error);
    }
  }


  /** GET pesquisa Buscar registros de imagens por ID/arqTipo/arqNome (query) */
  async searchImagens(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, arqTipo,arqNome } = req.query;
      const imagens = await this.imagensRepository.searchImagens({
        id: id ? Number(id) : undefined,
        arqTipo: arqTipo as string,
        arqNome: arqNome as string,
      });
      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  /** GET pesquisa Buscar por ArqTipo em imagens */
  async searchImagensArqTipo(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query?.text as string;
      const imagens = await this.imagensRepository.searchArqTipoImagens(text);
      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  /** GET pesquisa Buscar por arqNome em imagens */
  async searchImagensArqName(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query?.text as string;
      const imagens = await this.imagensRepository.searchArqNameImagens(text);
      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de imagens por nome */
  async findOneImagensArqNome(req: Request, res: Response, next: NextFunction) {
    try {
      const arqNome = req.query?.nome as string;
      if (!arqNome) {
        return res.status(400).send({ success: false, message: "Parâmetro 'imagens' é obrigatório" });
      }

      const imagens = await this.imagensRepository.findOneArqNomeImagens(arqNome);
      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de imagens por arqNome */
  async findAllImagensArqNome(req: Request, res: Response, next: NextFunction) {
    try {
      const arqNome = req.query?.nome as string;
      if (!arqNome) {
        return res.status(400).send({ success: false, message: "Parâmetro 'arqNome' é obrigatório" });
      }

      const imagens = await this.imagensRepository.findAllArqNomeImagens(arqNome);
      if (imagens.length === 0) {
        return res.status(404).send({ success: false, message: "Nenhuma imagens encontrada com esse nome" });
      }

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  //** GET Busca todos os registros de imagens por arqTipo */
  async findAllImagensArqTipo(req: Request, res: Response, next: NextFunction) {
    try {
      const arqTipo = req.query?.arqTipo as string;

      if (!arqTipo) {
        return res.status(400).send({
          success: false,
          message: "Parâmetro 'arqTipo' é obrigatório"
        });
      }

      // validação manual
      if (arqTipo !== 'logo' && arqTipo !== 'avatar') {
        return res.status(400).send({
          success: false,
          message: "Parâmetro 'arqTipo' inválido. Use 'logo' ou 'avatar'."
        });
      }

      const imagens = await this.imagensRepository.findAllArqTipoImagens(arqTipo);

      if (imagens.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Nenhuma imagem encontrada com esse tipo"
        });
      }

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }
}


