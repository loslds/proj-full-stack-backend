
  import { NextFunction, Request, Response } from 'express';
  import { CodsegsRepository } from './codsegs.repository';
  import { CodsegsCreate, CodsegsUpdate } from './codsegs.dto';
  
  export class CodsegsController {
    constructor(private readonly codsegsRepository: CodsegsRepository) {}
  
    /** POST Cria Tabela Codsegs */
    async create(
      req: Request<{}, {}, CodsegsCreate>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const codsegs = await this.codsegsRepository.createCodsegs(req.body);
        return res.status(201).send({ success: true, codsegs });
      } catch (error) {
        next(error);
      }
    }
  
    /** PATCH Atualiza um registro de Codsegs */
    async update(
      req: Request<{ codsegsId: string }, {}, Partial<CodsegsUpdate>>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const codsegsId = Number(req.params.codsegsId);
        const codsegs = await this.codsegsRepository.updateCodsegs(codsegsId, req.body);
        return res.status(200).send({ success: true, codsegs });
      } catch (error) {
        next(error);
      }
    }
  
    /** DELETE Remove um registro de Codsegs */
    async remove(
      req: Request<{ codsegsId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const codsegsId = Number(req.params.codsegsId);
        await this.codsegsRepository.deleteCodsegs(codsegsId);
        return res.status(200).send({ success: true });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Codsegs */
    async findAll(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const codsegs = await this.codsegsRepository.findCodsegsAll();
        return res.status(200).send({ success: true, codsegs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Docs por ID */
    async getOne(
      req: Request<{ codsegsId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const codsegsId = Number(req.params.codsegsId);
        const codsegs = await this.codsegsRepository.findCodsegsById(codsegsId);
        return res.status(200).send({ success: true, codsegs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Codsegs por codigo */
    async findAllCodigo(
      req: Request<{}, {}, {}, { codigo: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { codigo } = req.query;
        if (!codigo) {
          return res.status(400).send({ success: false, message: 'codigo parameter is required' });
        }
        const codsegs = await this.codsegsRepository.findCodsegsAllCodigo(codigo);
        return res.status(200).send({ success: true, codsegs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Busca um registro de Docs por codigo */
    async findByCodigo(
      req: Request<{}, {}, {}, { codigo: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const { codigo } = req.query;
        if (!codigo) {
          return res.status(400).send({ success: false, message: 'codigo parameter is required' });
        }
        const codsegs = await this.codsegsRepository.findCodsegsByCodigo(codigo);
        return res.status(200).send({ success: true, codsegs });
      } catch (error) {
        next(error);
      }
    }
  
    /** GET Lista todos os registros de Email por cadastroId */
    async findByCadastroId(
      req: Request<{ cadastroId: string }>,
      res: Response,
      next: NextFunction
    ) {
      try {
        const cadastroId = Number(req.params.cadastroId);
        const codsegs = await this.codsegsRepository.findCodsegsByCadastroId(cadastroId);
        return res.status(200).send({ success: true, codsegs });
      } catch (error) {
        next(error);
      }
    }
  }
  