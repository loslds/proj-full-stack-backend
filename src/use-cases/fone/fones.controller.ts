
import { NextFunction, Request, Response } from 'express';
import { FonesRepository } from './fones.repository';
import { FonesCreate, FonesUpdate } from './fones.dto';

export class FonesController {
  constructor(private readonly fonesRepository: FonesRepository) {}

  /** POST Cria Tabela Fones */
  async create(
    req: Request<{}, {}, FonesCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fones = await this.fonesRepository.createFones(req.body);
      return res.status(201).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Fones */
  async update(
    req: Request<{ fonesId: string }, {}, Partial<FonesUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fonesId = Number(req.params.fonesId);
      const fones = await this.fonesRepository.updateFones(fonesId, req.body);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Fones */
  async remove(
    req: Request<{ fonesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fonesId = Number(req.params.fonesId);
      await this.fonesRepository.deleteFones(fonesId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Fones */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fones = await this.fonesRepository.findFonesAll();
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Fones por ID */
  async getOne(
    req: Request<{ fonesId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const fonesId = Number(req.params.fonesId);
      const fones = await this.fonesRepository.findFonesById(fonesId);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }

  ////////// fieldrs ///////////////////////////
  /** GET Lista todos os registros de Fones por cpf */
  async findAllFonex(
    req: Request<{}, {}, {}, { fonex: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fonex } = req.query;
      if (!fonex) {
        return res.status(400).send({ success: false, message: 'fonex parameter is required' });
      }
      const fones = await this.fonesRepository.findFonesAllFonex(fonex);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Fones por fonex */
  async findByFonex(
    req: Request<{}, {}, {}, { fonex: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fonex } = req.query;
      if (!fonex) {
        return res.status(400).send({ success: false, message: 'fonex parameter is required' });
      }
      const fones = await this.fonesRepository.findFonesByFonex(fonex);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Lista todos os registros de Fones por cpf */
  async findAllFonec(
    req: Request<{}, {}, {}, { fonec: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fonec } = req.query;
      if (!fonec) {
        return res.status(400).send({ success: false, message: 'fonec parameter is required' });
      }
      const fones = await this.fonesRepository.findFonesAllFonex(fonec);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Fones por fonec */
  async findByFonec(
    req: Request<{}, {}, {}, { fonec: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fonec } = req.query;
      if (!fonec) {
        return res.status(400).send({ success: false, message: 'fonec parameter is required' });
      }
      const fones = await this.fonesRepository.findFonesByFonex(fonec);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Fones por cpf */
  async findAllFonez(
    req: Request<{}, {}, {}, { fonez: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fonez } = req.query;
      if (!fonez) {
        return res.status(400).send({ success: false, message: 'fonez parameter is required' });
      }
      const fones = await this.fonesRepository.findFonesAllFonex(fonez);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Fones por fonez */
  async findByFonez(
    req: Request<{}, {}, {}, { fonez: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fonez } = req.query;
      if (!fonez) {
        return res.status(400).send({ success: false, message: 'fonez parameter is required' });
      }
      const fones = await this.fonesRepository.findFonesByFonex(fonez);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Lista todos os registros de Fones por cadastrosId */
  async findByCadastrosId(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);
      const fones = await this.fonesRepository.findFonesByCadastrosId(cadastrosId);
      return res.status(200).send({ success: true, fones });
    } catch (error) {
      next(error);
    }
  }
}
