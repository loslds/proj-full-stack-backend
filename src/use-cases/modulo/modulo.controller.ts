import type { NextFunction, Request, Response } from 'express';

import type { ModuloRepository } from './modulo.repository';
import { ModuloCreate, ModuloUpdate } from './modulo.dto';

export class ModuloController {
  constructor(private readonly moduloRepository: ModuloRepository) {}

  /** GET */
  async findModuloAll(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const modulos = await this.moduloRepository.findModuloAll();
    return res.status(200).send({ success: true, modulos }).end();
  }

  /** GET */
  async getOne(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const { params } = req;
    const moduloId = Number(params?.moduloId);

    if (!moduloId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid moduloId' })
        .end();
    }

    const modulo = await this.moduloRepository.findModuloById(moduloId);
    return res.status(200).send({ success: true, modulo }).end();
  }

  /** POST */
  async create(
    req: Request<any, any, ModuloCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body } = req;
    const modulo = await this.moduloRepository.createModulo(body);
    return res.status(200).send({ success: true, modulo }).end();
  }

  /** PATCH */
  async update(
    req: Request<any, any, ModuloUpdate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body, params } = req;
    const moduloId = Number(params?.moduloId);

    if (!moduloId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid moduloId' })
        .end();
    }

    const modulo = await this.moduloRepository.updateModulo(moduloId, body);
    return res.status(200).send({ success: true, modulo }).end();
  }

  /** DEL */
  async remove(
    req: Request<any, any, ModuloCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { params } = req;
    const moduloId = Number(params?.moduloId);

    if (!moduloId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid moduloId' })
        .end();
    }

    const deleted = await this.moduloRepository.deleteModulo(moduloId);
    return res.status(200).send({ success: !!deleted?.affected }).end();
  }
}
