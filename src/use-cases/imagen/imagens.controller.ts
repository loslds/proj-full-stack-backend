// C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.controller.ts

import { Request, Response, NextFunction } from 'express';
import { ImagensRepository } from './imagens.repository';
import { ImagensCreate, ImagensUpdate } from './imagens.dto';

export class ImagensController {
  constructor(private readonly imagensRepository: ImagensRepository) {}

  // ==========================================================
  // 1 - POST → Cria nova imagem
  // ==========================================================
  async createNewImagens(
    req: Request<{}, {}, ImagensCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const imagens = await this.imagensRepository.createImagens(req.body);
      return res.status(201).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 2 - PATCH → Atualiza imagem por ID
  // ==========================================================
  async updateIdImagens(
    req: Request<{ imagensId: string }, {}, Partial<ImagensUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    const imagensId = Number(req.params.imagensId);

    if (!imagensId || Number.isNaN(imagensId) || imagensId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'imagensId inválido' });
    }

    try {
      const imagens = await this.imagensRepository.updateImagens(
        imagensId,
        req.body
      );

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 3 - DELETE → Remove imagem por ID
  // ==========================================================
  async removeImagensId(
    req: Request<{ imagensId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const imagensId = Number(req.params.imagensId);

    if (!imagensId || Number.isNaN(imagensId) || imagensId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'imagensId inválido' });
    }

    try {
      await this.imagensRepository.deleteImagens(imagensId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 4 - GET → Lista todas
  // ==========================================================
  async findAllImagens(req: Request, res: Response, next: NextFunction) {
    try {
      const imagens = await this.imagensRepository.findImagensAll(
        {},
        { id: 'ASC' }
      );

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 5 - GET → Busca por ID
  // ==========================================================
  async getOneIdImagens(
    req: Request<{ imagensId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const imagensId = Number(req.params.imagensId);

    if (!imagensId || Number.isNaN(imagensId) || imagensId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'imagensId inválido' });
    }

    try {
      const imagens = await this.imagensRepository.findImagensById(imagensId);

      if (!imagens) {
        return res
          .status(404)
          .send({ success: false, message: 'Imagem não encontrada' });
      }

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 6 - GET → Busca por nome exato
  // ==========================================================
  async findOneNomeImagens(
    req: Request<{}, {}, {}, { nome?: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).send({
        success: false,
        message: 'Parâmetro nome é obrigatório'
      });
    }

    try {
      const imagens = await this.imagensRepository.findOneNomeImagens(
        String(nome)
      );

      if (!imagens) {
        return res
          .status(404)
          .send({ success: false, message: 'Imagem não encontrada' });
      }

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 7 - GET → Busca por tipo exato
  // ==========================================================
  async findOneTipoImagens(
    req: Request<{}, {}, {}, { tipo?: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { tipo } = req.query;

    if (!tipo) {
      return res.status(400).send({
        success: false,
        message: 'Parâmetro tipo é obrigatório'
      });
    }

    try {
      const imagens = await this.imagensRepository.findOneTipoImagens(
        String(tipo)
      );

      if (!imagens) {
        return res
          .status(404)
          .send({ success: false, message: 'Imagem não encontrada' });
      }

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 8 - GET → Pesquisa personalizada
  // ==========================================================
  async searchImagens(
    req: Request<{}, {}, {}, { id?: string; nome?: string; tipo?: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.query.id ? Number(req.query.id) : undefined;
      const nome = req.query.nome ? String(req.query.nome) : undefined;
      const tipo = req.query.tipo ? String(req.query.tipo) : undefined;

      if (req.query.id && (!id || Number.isNaN(id) || id <= 0)) {
        return res.status(400).send({
          success: false,
          message: 'Parâmetro id inválido'
        });
      }

      const imagens = await this.imagensRepository.searchImagens({
        id,
        nome,
        tipo
      });

      return res.status(200).send({
        success: true,
        total: imagens.length,
        imagens
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 9 - GET → Pesquisa por nome parcial
  // ==========================================================
  async searchNomeImagens(
    req: Request<{}, {}, {}, { text?: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const imagens = await this.imagensRepository.searchNomeImagens(text);

      return res.status(200).send({
        success: true,
        total: imagens.length,
        imagens
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 10 - GET → Pesquisa por tipo parcial
  // ==========================================================
  async searchTipoImagens(
    req: Request<{}, {}, {}, { text?: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const text = req.query.text ? String(req.query.text) : undefined;
      const imagens = await this.imagensRepository.searchTipoImagens(text);

      return res.status(200).send({
        success: true,
        total: imagens.length,
        imagens
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 11 - GET → Busca todas por nome exato
  // ==========================================================
  async findAllNomeImagens(
    req: Request<{}, {}, {}, { nome?: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).send({
        success: false,
        message: 'Parâmetro nome é obrigatório'
      });
    }

    try {
      const imagens = await this.imagensRepository.findAllNomeImagens(
        String(nome)
      );

      return res.status(200).send({
        success: true,
        total: imagens.length,
        imagens
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 12 - GET → Busca todas por tipo exato
  // ==========================================================
  async findAllTipoImagens(
    req: Request<{}, {}, {}, { tipo?: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { tipo } = req.query;

    if (!tipo) {
      return res.status(400).send({
        success: false,
        message: 'Parâmetro tipo é obrigatório'
      });
    }

    try {
      const imagens = await this.imagensRepository.findAllTipoImagens(
        String(tipo)
      );

      return res.status(200).send({
        success: true,
        total: imagens.length,
        imagens
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================
  // 13 - GET → Busca por path_dest
  // ==========================================================
  async findOnePathDestImagens(
    req: Request<{}, {}, {}, { path_dest?: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { path_dest } = req.query;

    if (!path_dest) {
      return res.status(400).send({
        success: false,
        message: 'Parâmetro path_dest é obrigatório'
      });
    }

    try {
      const imagens = await this.imagensRepository.findOnePathDestImagens(
        String(path_dest)
      );

      if (!imagens) {
        return res
          .status(404)
          .send({ success: false, message: 'Imagem não encontrada' });
      }

      return res.status(200).send({ success: true, imagens });
    } catch (error) {
      next(error);
    }
  }
}