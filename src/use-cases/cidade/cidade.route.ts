
import { Router, Request, Response, NextFunction } from 'express';
import { CidadeController } from './cidade.controller';
import { CidadeRepository } from './cidade.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './cidade.validation';

const cidadeRepository = new CidadeRepository(dataSource);
const controller = new CidadeController(cidadeRepository);
const cidadeRoute = Router();

cidadeRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
cidadeRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
cidadeRoute.get('/:cidadeId', (req: Request<{ cidadeId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
cidadeRoute.patch('/:cidadeId', updateValidation, (req: Request<{ cidadeId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
cidadeRoute.delete('/:cidadeId', (req: Request<{ cidadeId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));

cidadeRoute.get('/by-nmcidade', (req: Request<{}, {}, {}, { nmcidade: string }>, res: Response, next: NextFunction) => controller.findByNmCidade(req, res, next));

cidadeRoute.get('/by-nmcidade', (req: Request<{}, {}, {}, { nmcidade: string }>, res: Response, next: NextFunction) => controller.findAllNmCidade(req, res, next));
cidadeRoute.get('/by-nmestado', (req: Request<{}, {}, {}, { nmestado: string }>, res: Response, next: NextFunction) => controller.findByNmEstado(req, res, next));
cidadeRoute.get('/by-nmestado', (req: Request<{}, {}, {}, { nmestado: string }>, res: Response, next: NextFunction) => controller.findAllNmEstado(req, res, next));
cidadeRoute.get('/by-uf', (req: Request<{}, {}, {}, { uf: string }>, res: Response, next: NextFunction) => controller.findAllUf(req, res, next));

export { cidadeRoute, cidadeRepository };

