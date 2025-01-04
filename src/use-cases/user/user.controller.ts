import type { NextFunction, Request, Response } from 'express';
import type { UserRepository } from './user.repository';
import { UserCreate, UserUpdate } from './user.dto';

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  /** GET */
  async findAll(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const users = await this.userRepository.findAll();
    return res.status(200).send({ success: true, users }).end();
  }

  /** GET */
  async getOne(
    req: Request<any, any, any>,
    res: Response<Record<string, any>>,
    _next: NextFunction,
  ) {
    const { params } = req;
    const userId = Number(params?.userId);

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid userId' })
        .end();
    }

    const user = await this.userRepository.findUserById(userId);
    return res.status(200).send({ success: true, user }).end();
  }

  /** POST */
  async create(
    req: Request<any, any, UserCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body } = req;
    const user = await this.userRepository.create(body);
    return res.status(200).send({ success: true, user }).end();
  }

  /** PATCH */
  async update(
    req: Request<any, any, UserUpdate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { body, params } = req;
    const userId = Number(params?.userId);

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid userId' })
        .end();
    }

    const user = await this.userRepository.update(userId, body);
    return res.status(200).send({ success: true, user }).end();
  }

  /** DEL */
  async remove(
    req: Request<any, any, UserCreate>,
    res: Response,
    _next: NextFunction,
  ) {
    const { params } = req;
    const userId = Number(params?.userId);

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid userId' })
        .end();
    }

    const deleted = await this.userRepository.delete(userId);
    return res.status(200).send({ success: !!deleted?.affected }).end();
  }
}
