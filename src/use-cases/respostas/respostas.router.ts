
import { Router, Request, Response, NextFunction } from 'express';
import { RespostasController } from './respostas.controller';
import { RespostasRepository } from './respostas.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './respostas.validation';

const respostasRepository = new RespostasRepository(dataSource);
const controller = new RespostasController(respostasRepository);
const respostasRoute = Router();

respostasRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
respostasRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
respostasRoute.get('/:respostasId', (req: Request<{ respostasId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
respostasRoute.patch('/:respostasId', updateValidation, (req: Request<{ respostasId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
respostasRoute.delete('/:respostasId', (req: Request<{ respostasId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
respostasRoute.get('/by-perg1', (req: Request<{}, {}, {}, { perg1: string }>, res: Response, next: NextFunction) => controller.findByPerg1(req, res, next));
respostasRoute.get('/by-perg2', (req: Request<{}, {}, {}, { perg2: string }>, res: Response, next: NextFunction) => 
controller.findByPerg2(req, res, next));
respostasRoute.get('/by-perg3', (req: Request<{}, {}, {}, { perg3: string }>, res: Response, next: NextFunction) => controller.findByPerg3(req, res, next));

respostasRoute.get('/by-resp1', (req: Request<{}, {}, {}, { resp1: string }>, res: Response, next: NextFunction) => controller.findByResp1(req, res, next));
respostasRoute.get('/by-resp2', (req: Request<{}, {}, {}, { resp2: string }>, res: Response, next: NextFunction) => 
controller.findByResp2(req, res, next));
respostasRoute.get('/by-resp3', (req: Request<{}, {}, {}, { resp3: string }>, res: Response, next: NextFunction) => controller.findByResp3(req, res, next));

// Rota para buscar respostas por UsersId
respostasRoute.get('/respostas/by-users/:usersId', (req: Request<{ usersId: string }>, res: Response, next: NextFunction) => 
controller.findByUsersId(req, res, next)
);

export { respostasRoute, respostasRepository };

