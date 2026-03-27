import { Router, Request, Response, NextFunction } from 'express';
import { FonesController } from './fones.controller';
import { FonesRepository } from './fones.repository';
import { dataSource } from '../start/dbSource';
import { createValidation, updateValidation } from './fones.validation';

const fonesRepository = new FonesRepository(dataSource);
const controller = new FonesController(fonesRepository);
const fonesRoute = Router();

// Rota para listar todos os fones
fonesRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
// Rota para criar um novo fones
fonesRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
// Rota para buscar em fones atraves do ID
fonesRoute.get('/:fonesId', (req: Request<{ fonesId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
// Rota para atualiza em fones atraves do ID
fonesRoute.patch('/:fonesId', updateValidation, (req: Request<{ fonesId: string }>, res: Response, next: NextFunction) =>   controller.update(req, res, next));
// Rota para deletar em em fones atraves do ID
fonesRoute.delete('/:fonesId', (req: Request<{ fonesId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
// Rota para buscar em fones reg. fonex
fonesRoute.get('/by-fonex', (req: Request<{}, {}, {}, { fonex: string }>, res: Response, next: NextFunction) => controller.findByFonex(req, res, next));
// Rota para buscar em fones todos reg. fonex (plural)
fonesRoute.get('/by-fonexs', (req: Request<{}, {}, {}, { fonex: string }>, res: Response, next: NextFunction) => controller.findAllFonex(req, res, next));

// Rota para buscar fones por cadastrosId
fonesRoute.get('/fones/by-cadastros/:cadastrosId', (req: Request<{ cadastrosId: string }>, res: Response, next: NextFunction) => 
  controller.findByCadastrosId(req, res, next)
);

export { fonesRoute, fonesRepository };
