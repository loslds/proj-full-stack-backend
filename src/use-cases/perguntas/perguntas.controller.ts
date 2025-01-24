import { NextFunction, Request, Response } from 'express';
import { PerguntasRepository } from './perguntas.repository';
import { PerguntasCreate, PerguntasUpdate } from './perguntas.dto';
import { PerguntasEntity } from './perguntas.entity';
import { DeepPartial } from 'typeorm';

export class PerguntasController {
  constructor(private readonly perguntasRepository: PerguntasRepository) {}

/** POST Cria um novo registro de Perguntas */
  async create(
    req: Request<{}, {}, PerguntasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const perguntas = await this.perguntasRepository.createPerguntas(req.body);
      return res.status(201).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Perguntas */
  async update(
    req: Request<{ perguntasId: string }, {}, PerguntasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const perguntasId = Number(req.params.perguntasId);
    if (isNaN(perguntasId) || perguntasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid perguntasId' })
        .end();
    }

    try {
      const perguntas = await this.perguntasRepository.updatePerguntas(
        perguntasId,
        req.body as DeepPartial<PerguntasEntity>
      );
      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Perguntas */
  async remove(
    req: Request<{ perguntasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const perguntasId = Number(req.params.perguntasId);
    if (isNaN(perguntasId) || perguntasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid perguntasId' })
        .end();
    }

    try {
      await this.perguntasRepository.deletePerguntas(perguntasId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Perguntas */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const perguntas = await this.perguntasRepository.findPerguntaslAll();
      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Perguntas por ID */
  async getOne(
    req: Request<{ perguntasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const perguntasId = Number(req.params.perguntasId);

    if (isNaN(perguntasId) || perguntasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid perguntasId' })
        .end();
    }

    try {
      const perguntas = await this.perguntasRepository.findPerguntasById(perguntasId);
      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  ///////////////////////////////

  /** GET Lista todos os registros de Perguntas por descrperg */
  async findAllDescrperg(
    req: Request<{}, {}, {}, { descrperg: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { descrperg } = req.query;
      if (!descrperg) {
        return res.status(400).send({ success: false, message: 'descrperg parameter is required' });
      }
      const perguntas = await this.perguntasRepository.findPerguntasAllDescrperg(descrperg);
      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Perguntas por descrperg */
  async findByDescrperg(
    req: Request<{}, {}, {}, { descrperg: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { descrperg } = req.query;
      if (!descrperg) {
        return res.status(400).send({ success: false, message: 'descrperg parameter is required' });
      }
      const perguntas = await this.perguntasRepository.findPerguntasByDescperg(descrperg);
      return res.status(200).send({ success: true, perguntas });
    } catch (error) {
      next(error);
    }
  }

}
