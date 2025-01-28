import { Router, Request, Response, NextFunction } from 'express';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './users.validation';

const usersRepository = new UsersRepository(dataSource);
const controller = new UsersController(usersRepository);
const usersRoute = Router();

// Rota para listar todos em users
usersRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
// Rota para criar um novo users
usersRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
// Rota para buscar em es atraves do ID
usersRoute.get('/:usersId', (req: Request<{ usersId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
// Rota para atualiza em users atraves do ID
usersRoute.patch('/:usersId', updateValidation, (req: Request<{ usersId: string }>, res: Response, next: NextFunction) =>   controller.update(req, res, next));
// Rota para deletar em users atraves do ID
usersRoute.delete('/:usersId', (req: Request<{ usersId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));

// Rota para buscar em users reg. bloqueio
usersRoute.get('/by-bloqueio', (req: Request<{}, {}, {}, { bloqueado: number }>, res: Response, next: NextFunction) => controller.findByBloqueio(req, res, next));
// Rota para buscar em users todos reg. bloqueio (plural)
usersRoute.get('/by-bloqueios', (req: Request<{}, {}, {}, { bloqueado: number }>, res: Response, next: NextFunction) => controller.findAllBloqueio(req, res, next));

// Rota para buscar em users reg. ult_acesso
usersRoute.get('/by-ult_acesso', (req: Request<{}, {}, {}, { ult_acesso: Date }>, res: Response, next: NextFunction) => controller.findByUltAcesso(req, res, next));
// Rota para buscar em users todos reg. ult_acesso (plural)
usersRoute.get('/by-ult_acessos', (req: Request<{}, {}, {}, { ult_acesso: Date }>, res: Response, next: NextFunction) => controller.findAllUltAcesso(req, res, next));

// Rota para buscar em users reg. ult_acesso
usersRoute.get('/by-data_login', (req: Request<{}, {}, {}, { data_login: Date }>, res: Response, next: NextFunction) => controller.findByDataLogin(req, res, next));
// Rota para buscar em users todos reg. ult_acesso (plural)
usersRoute.get('/by-data_logins', (req: Request<{}, {}, {}, { data_login: Date }>, res: Response, next: NextFunction) => controller.findAllDataLogin(req, res, next));

// Rota para buscar em users um reg. data_logout 
usersRoute.get('/by-data_logout', (req: Request<{}, {}, {}, { data_logout: Date }>, res: Response, next: NextFunction) => controller.findByDataLogout(req, res, next));
// Rota para buscar em users todos reg. ult_acesso (plural)
usersRoute.get('/by-data_logouts', (req: Request<{}, {}, {}, { data_logout: Date }>, res: Response, next: NextFunction) => controller.findAllDataLogout(req, res, next));

// Rota para buscar documento por cadastroId
usersRoute.get('/fones/by-cadastros/:cadastrosId', (req: Request<{ cadastrosId: string }>, res: Response, next: NextFunction) => 
  controller.findByCadastrosId(req, res, next)
);

export { usersRoute, usersRepository };
