
// C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.route.ts
import { dbSource } from '../../database';
import { Router, Request, Response, NextFunction } from 'express';
import { SystablesController } from './systables.controller';
import { SystablesRepository } from './systables.repository';
import { createValidation, updateValidation } from './systables.validation';

const systablesRepository = new SystablesRepository(dbSource);
const controller = new SystablesController(systablesRepository);
const systableRoute = Router();

systableRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
systableRoute.get('/:systablesId', (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
systableRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
systableRoute.patch('/:systablesId', updateValidation, (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
systableRoute.delete('/:systablesId', (req: Request<{ systablesId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
systableRoute.get('/search', (req, res, next) => controller.search(req, res, next));
/////////////////////////////
systableRoute.get('/search-name', (req, res, next) => controller.searchByName(req, res, next));
systableRoute.get('/search-chkdb', (req, res, next) => controller.searchByChkdb(req, res, next));
systableRoute.get('/one-nome', (req, res, next) => controller.findOneNome(req, res, next));
systableRoute.get('/all-nome', (req, res, next) => controller.findAllNome(req, res, next));
systableRoute.get('/all-chkdb', (req, res, next) => controller.findAllChkdb(req, res, next));
systableRoute.get('/all-NumberReg', (req, res, next) => controller.findAllNumberregs(req, res, next));


////////////////////////////
export { systableRoute, systablesRepository };

