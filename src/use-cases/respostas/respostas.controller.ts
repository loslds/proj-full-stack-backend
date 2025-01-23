
import { NextFunction, Request, Response } from 'express';
import { RespostasRepository } from './respostas.repository';
import { RespostasCreate, RespostasUpdate } from './respostas.dto';
import { RespostasEntity } from './respostas.entity';
import { DeepPartial } from 'typeorm';

export class RespostasController {
  constructor(private readonly respostasRepository: RespostasRepository) {}

  /** POST Cria um novo registro de Respostas */
  async create(
    req: Request<{}, {}, RespostasCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const respostas = await this.respostasRepository.createRespostas(req.body);
      return res.status(201).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Respostas */
  async update(
    req: Request<{ respostasId: string }, {}, RespostasUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const respostasId = Number(req.params.respostasId);
    if (isNaN(respostasId) || respostasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid respostasId' })
        .end();
    }

    try {
      const respostas = await this.respostasRepository.updateRespostas(
        respostasId,
        req.body as DeepPartial<RespostasEntity>
      );
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Respostas */
  async remove(
    req: Request<{ respostasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const respostasId = Number(req.params.respostasId);
    if (isNaN(respostasId) || respostasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid respostasId' })
        .end();
    }

    try {
      await this.respostasRepository.deleteRespostas(respostasId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Respostas */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const respostas = await this.respostasRepository.findRespostasAll();
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Respostas por ID */
  async getOne(
    req: Request<{ respostasId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const respostasId = Number(req.params.respostasId);

    if (isNaN(respostasId) || respostasId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid respostasId' })
        .end();
    }

    try {
      const respostas = await this.respostasRepository.findRespostasById(respostasId);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }
 
  /** GET Busca um registros de Respostas por perg1 */
  async findByPerg1(
    req: Request<{}, {}, {}, { perg1: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { perg1 } = req.query;

    if (!perg1) {
      return res
        .status(400)
        .send({ success: false, message: 'Perg1 parameter is required' })
        .end();
    }

    try {
      const respostas = await this.respostasRepository.findRespostasByPerg1(perg1);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Respostas por perg2 */
  async findByPerg2(
    req: Request<{}, {}, {}, { perg2: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { perg2 } = req.query;

    if (!perg2) {
      return res
        .status(400)
        .send({ success: false, message: 'Perg2 parameter is required' })
        .end();
    }

    try {
      const respostas = await this.respostasRepository.findRespostasByPerg2(perg2);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Busca um registros de Respostas por perg3 */
  async findByPerg3(
    req: Request<{}, {}, {}, { perg3: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { perg3 } = req.query;
  
    if (!perg3) {
      return res
        .status(400)
        .send({ success: false, message: 'Perg3 parameter is required' })
        .end();
    }
  
    try {
      const respostas = await this.respostasRepository.findRespostasByPerg3(perg3);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Respostas por resp1 */
  async findByResp1(
    req: Request<{}, {}, {}, { resp1: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { resp1 } = req.query;

    if (!resp1) {
      return res
        .status(400)
        .send({ success: false, message: 'Resp1 parameter is required' })
        .end();
    }

    try {
      const respostas = await this.respostasRepository.findRespostasByResp1(resp1);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Respostas por resp2 */
  async findByResp2(
    req: Request<{}, {}, {}, { resp2: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { resp2 } = req.query;

    if (!resp2) {
      return res
        .status(400)
        .send({ success: false, message: 'Resp2 parameter is required' })
        .end();
    }

    try {
      const respostas = await this.respostasRepository.findRespostasByResp2(resp2);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Respostas por resp3 */
  async findByResp3(
    req: Request<{}, {}, {}, { resp3: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { resp3 } = req.query;

    if (!resp3) {
      return res
        .status(400)
        .send({ success: false, message: 'Resp3 parameter is required' })
        .end();
    }

    try {
      const respostas = await this.respostasRepository.findRespostasByResp3(resp3);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }
 
  /** GET Lista todos os registros de Respostas por cadastroId */
  async findByCadastroId(
    req: Request<{ cadastroId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastroId = Number(req.params.cadastroId);
      const respostas = await this.respostasRepository.findRespostasByCadastroId(cadastroId);
      return res.status(200).send({ success: true, respostas });
    } catch (error) {
      next(error);
    }
  }


}