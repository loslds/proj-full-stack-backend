import { Router, Request, Response, NextFunction } from 'express';
import { PerguntasController } from './perguntas.controller';
import { PerguntasRepository } from './perguntas.repository';
import { dataSource } from '../start/dbSource';
import { createValidation, updateValidation } from './perguntas.validation';

const perguntasRepository = new PerguntasRepository(dataSource);
const controller = new PerguntasController(perguntasRepository);
const perguntasRoute = Router();

perguntasRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
perguntasRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
perguntasRoute.get('/:perguntasId', (req: Request<{ perguntasId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
perguntasRoute.patch('/:perguntasId', updateValidation, (req: Request<{ perguntasId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
perguntasRoute.delete('/:perguntasId', (req: Request<{ perguntasId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));


perguntasRoute.get('/by-descrperg', (req: Request<{}, {}, {}, { descrperg: string }>, res: Response, next: NextFunction) => controller.findByDescrperg(req, res, next));
perguntasRoute.get('/by-descrpergs', (req: Request<{}, {}, {}, { descrperg: string }>, res: Response, next: NextFunction) => controller.findAllDescrperg(req, res, next));

export { perguntasRoute, perguntasRepository };
