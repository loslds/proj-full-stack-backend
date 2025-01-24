
import { Router, Request, Response, NextFunction } from 'express';
import { CidadesController } from './cidades.controller';
import { CidadesRepository } from './cidades.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './cidades.validation';

const cidadesRepository = new CidadesRepository(dataSource);
const controller = new CidadesController(cidadesRepository);
const cidadesRoute = Router();

cidadesRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
cidadesRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
cidadesRoute.get('/:cidadesId', (req: Request<{ cidadesId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
cidadesRoute.patch('/:cidadesId', updateValidation, (req: Request<{ cidadesId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
cidadesRoute.delete('/:cidadesId', (req: Request<{ cidadesId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
cidadesRoute.get('/by-nmcidade', (req: Request<{}, {}, {}, { nmcidade: string }>, res: Response, next: NextFunction) => controller.findByNmCidade(req, res, next));
cidadesRoute.get('/by-nmcidades', (req: Request<{}, {}, {}, { nmcidade: string }>, res: Response, next: NextFunction) => controller.findAllNmCidade(req, res, next));
cidadesRoute.get('/by-nmestado', (req: Request<{}, {}, {}, { nmestado: string }>, res: Response, next: NextFunction) => controller.findByNmEstado(req, res, next));
cidadesRoute.get('/by-nmestados', (req: Request<{}, {}, {}, { nmestado: string }>, res: Response, next: NextFunction) => controller.findAllNmEstado(req, res, next));
cidadesRoute.get('/by-uf', (req: Request<{}, {}, {}, { uf: string }>, res: Response, next: NextFunction) => controller.findAllUf(req, res, next));
// Rota para buscar documento por cadastroId
cidadesRoute.get('/cidades/by-cadastro/:cadastroId', (req: Request<{ cadastroId: string }>, res: Response, next: NextFunction) => 
  controller.findByCadastroId(req, res, next)
);

export { cidadesRoute, cidadesRepository };

