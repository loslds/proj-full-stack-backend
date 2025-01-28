


import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from './users.repository';
import { UsersCreate, UsersUpdate } from './users.dto';

export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** POST Cria Tabela Users */
  async create(
    req: Request<{}, {}, UsersCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await this.usersRepository.createUsers(req.body);
      return res.status(201).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Users */
  async update(
    req: Request<{ usersId: string }, {}, Partial<UsersUpdate>>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);
      const users = await this.usersRepository.updateUsers(usersId, req.body);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Users */
  async remove(
    req: Request<{ usersId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);
      await this.usersRepository.deleteUsers(usersId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Users */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await this.usersRepository.findUsersAll();
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Users por ID */
  async getOne(
    req: Request<{ usersId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usersId = Number(req.params.usersId);
      const users = await this.usersRepository.findUsersById(usersId);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  ////////// fieldrs ///////////////////////////
  /** GET Lista todos os registros de Users por bloqueado */
  async findAllBloqueio(
    req: Request<{}, {}, {}, { bloqueado: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bloqueado } = req.query;
      if (!bloqueado) {
        return res.status(400).send({ success: false, message: 'bloqueado parameter is required' });
      }
      const users = await this.usersRepository.findUsersAllBloqueado(bloqueado);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Users por bloqueado */
  async findByBloqueio(
    req: Request<{}, {}, {}, { bloqueado: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { bloqueado } = req.query;
      if (!bloqueado) {
        return res.status(400).send({ success: false, message: 'bloqueado parameter is required' });
      }
      const users = await this.usersRepository.findUsersByBloqueado(bloqueado);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Lista todos os registros de Users por qdd_acesso */
  async findAllQddAcesso(
    req: Request<{}, {}, {}, { qdd_acesso: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { qdd_acesso } = req.query;
      if (!qdd_acesso) {
        return res.status(400).send({ success: false, message: 'qdd_acesso parameter is required' });
      }
      const users = await this.usersRepository.findUsersAllQdd_Acesso(qdd_acesso);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Users por qdd_acesso */
  async findByQddAcesso(
    req: Request<{}, {}, {}, { qdd_acesso: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { qdd_acesso } = req.query;
      if (!qdd_acesso) {
        return res.status(400).send({ success: false, message: 'qdd_acesso parameter is required' });
      }
      const users = await this.usersRepository.findUserByQdd_Acesso(qdd_acesso);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Users por ult_acesso */
  async findAllUltAcesso(
    req: Request<{}, {}, {}, { ult_acesso: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { ult_acesso } = req.query;
      if (!ult_acesso) {
        return res.status(400).send({ success: false, message: 'ult_acesso parameter is required' });
      }
      const users = await this.usersRepository.findUsersAllUlt_Acesso(ult_acesso);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Users por ult_acesso */
  async findByUltAcesso(
    req: Request<{}, {}, {}, { ult_acesso: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { ult_acesso } = req.query;
      if (!ult_acesso) {
        return res.status(400).send({ success: false, message: 'ult_acesso parameter is required' });
      }
      const users = await this.usersRepository.findUsersByUlt_Acesso(ult_acesso);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  /** GET Lista todos os registros de Users por data_login */
  async findAllDataLogin(
    req: Request<{}, {}, {}, { data_login: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { data_login } = req.query;
      if (!data_login) {
        return res.status(400).send({ success: false, message: 'data_login parameter is required' });
      }
      const users = await this.usersRepository.findUsersAllData_Login(data_login);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Users por data_login */
  async findByDataLogin(
    req: Request<{}, {}, {}, { data_login: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { data_login } = req.query;
      if (!data_login) {
        return res.status(400).send({ success: false, message: 'data_login parameter is required' });
      }
      const users = await this.usersRepository.findUsersByData_Login(data_login);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Lista todos os registros de Users por data_logout */
  async findAllDataLogout(
    req: Request<{}, {}, {}, { data_logout: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { data_logout } = req.query;
      if (!data_logout) {
        return res.status(400).send({ success: false, message: 'data_logout parameter is required' });
      }
      const users = await this.usersRepository.findUsersAllData_Logout(data_logout);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  /** GET Busca um registro de Users por data_logout */
  async findByDataLogout(
    req: Request<{}, {}, {}, { data_logout: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { data_logout } = req.query;
      if (!data_logout) {
        return res.status(400).send({ success: false, message: 'data_logout parameter is required' });
      }
      const users = await this.usersRepository.findUsersByData_Logout(data_logout);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
  





  /** GET Lista todos os registros de Users por cadastroId */
  async findByCadastrosId(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastrosId = Number(req.params.cadastrosId);
      const users = await this.usersRepository.findUsersByCadastrosId(cadastrosId);
      return res.status(200).send({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
}

